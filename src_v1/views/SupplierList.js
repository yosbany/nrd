import FirebaseModel from '../models/FirebaseModel.js';
import Table from '../components/base/Table.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import TextInput from '../components/base/Text.js';
import Button from '../components/base/Button.js';
import Fila from '../components/base/Fila.js';
import Column from '../components/base/Column.js';
import Card from '../components/base/Card.js';
import Text from '../components/base/Text.js';
import { encodeId } from '../utils.js';

const SupplierList = {
    oninit: vnode => {
        vnode.state.searchText = '';
        vnode.state.suppliers = [];
        vnode.state.loading = true;

        SupplierList.loadSuppliers(vnode);
    },

    loadSuppliers: vnode => {
        FirebaseModel.getAll('Suppliers')
            .then(data => {
                // Agregar la propiedad formatPhoneNumber dinámicamente
                vnode.state.suppliers = data.map(supplier => ({
                    ...supplier,
                    formatPhoneNumber: SupplierList.formatPhoneNumber(supplier.phone)
                }));
                vnode.state.loading = false;
                m.redraw();
            })
            .catch(error => {
                console.error("[Audit][SupplierList] Error loading suppliers:", error);
                vnode.state.loading = false;
                m.redraw();
            });
    },

    filterItems: vnode => {
        if (!vnode.state.searchText) return vnode.state.suppliers;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.suppliers.filter(supplier =>
            Object.values(supplier).some(value =>
                value && value.toString().toLowerCase().includes(searchText)
            )
        );
    },

    onEdit: id => {
        m.route.set(`/suppliers/${encodeId(id)}`);
    },

    onDelete: (vnode, id) => {
        FirebaseModel.delete('Suppliers', id)
            .then(() => {
                SupplierList.loadSuppliers(vnode);
            })
            .catch(error => console.error("[Audit][SupplierList] Error deleting supplier:", error));
    },

    formatPhoneNumber: phone => {
        if (!phone) return "";
        const rawPhone = phone.replace(/^\+598/, '');
        return `+598 ${rawPhone.slice(0, 2)} ${rawPhone.slice(2, 5)} ${rawPhone.slice(5)}`;
    },

    view: vnode => {
        if (vnode.state.loading) {
            return m("div.uk-text-center", "Cargando...");
        }

        const filteredItems = SupplierList.filterItems(vnode);

        return m(Card, { title: "Proveedores", useCustomPadding: false }, [
            m(Breadcrumb, { items: [{ name: "Inicio", path: "/" }, { name: "Proveedores", path: "/suppliers" }] }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: 'expand' }, [
                    m(TextInput, {
                        value: vnode.state.searchText,
                        onInput: value => vnode.state.searchText = value,
                        placeholder: "Buscar...",
                        showLabel: false
                    })
                ]),
                m(Column, { width: 'auto' }, [
                    m(Button, {
                        type: "primary",
                        label: "Nuevo",
                        onClick: () => m.route.set('/suppliers/new')
                    })
                ])
            ]),
            m(Table, {
                bind: filteredItems,
                onEdit: id => SupplierList.onEdit(id),
                onDelete: id => SupplierList.onDelete(vnode, id)
            }, [
                m(Text, { label: "RUT", value: "bind.rut" }),
                m(Text, { label: "Nombre Comercial", value: "bind.tradeName" }),
                m(Text, { label: "Razón Social", value: "bind.businessName" }),
                m(Text, { label: "Celular", value: "bind.formatPhoneNumber" })  // Usamos la nueva propiedad
            ]),
            filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
        ]);
    }
};

export default SupplierList;
