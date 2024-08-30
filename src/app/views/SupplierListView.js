import SupplierListController from '../controllers/SupplierListController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Button from '../../core/ui/Button.js';
import Card from '../../core/ui/Card.js';
import TextInput from '../../core/ui/Text.js';
import Text from '../../core/ui/Text.js';
import Table from '../../core/ui/Table.js';
import LoadingSpinner from '../views/partials/Loading.js';

const SupplierListView = {
    oninit: SupplierListController.oninit,

    view: vnode => {
        const filteredItems = SupplierListController.filterItems(vnode);

        return [
            m(LoadingSpinner, { loading: vnode.state.loading }),
            m(Card, { title: "Proveedores", useCustomPadding: false }, [
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
                    onEdit: id => SupplierListController.onEdit(id),
                    onDelete: id => SupplierListController.onDelete(vnode, id)
                }, [
                    m(Text, { label: "RUT", value: "bind.rut" }),
                    m(Text, { label: "Nombre Comercial", value: "bind.tradeName" }),
                    m(Text, { label: "Razón Social", value: "bind.businessName" }),
                    m(Text, { label: "Celular", value: "bind.formatPhoneNumber" })
                ]),
                filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
            ])
        ];
    }
};

export default SupplierListView;
