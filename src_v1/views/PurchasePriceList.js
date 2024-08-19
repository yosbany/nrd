import FirebaseModel from '../models/FirebaseModel.js';
import Table from '../components/base/Table.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import TextInput from '../components/base/Text.js';
import Button from '../components/base/Button.js';
import Fila from '../components/base/Fila.js';
import Column from '../components/base/Column.js';
import Card from '../components/base/Card.js';
import Text from '../components/base/Text.js';
import Number from '../components/base/Number.js';
import DateInput from '../components/base/DatePicker.js';
import { encodeId } from '../utils.js';

const PurchasePriceList = {
    oninit: vnode => {
        vnode.state.searchText = '';
        vnode.state.purchasePrices = [];
        vnode.state.loading = true;

        PurchasePriceList.loadPurchasePrices(vnode);
    },

    loadPurchasePrices: vnode => {
        FirebaseModel.getAll('PurchasePrices')
            .then(data => {
                vnode.state.purchasePrices = data;
                vnode.state.loading = false;
                m.redraw();
            })
            .catch(error => {
                console.error("[Audit][PurchasePriceList] Error loading purchase prices:", error);
                vnode.state.loading = false;
                m.redraw();
            });
    },

    deepSearch: (obj, searchText) => {
        // Función recursiva para buscar el texto en todas las propiedades del objeto
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'string' || typeof value === 'number') {
                    if (value.toString().toLowerCase().includes(searchText)) {
                        return true;
                    }
                } else if (typeof value === 'object' && value !== null) {
                    if (PurchasePriceList.deepSearch(value, searchText)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    filterItems: vnode => {
        if (!vnode.state.searchText) return vnode.state.purchasePrices;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.purchasePrices.filter(purchasePrice =>
            PurchasePriceList.deepSearch(purchasePrice, searchText)
        );
    },

    onEdit: id => {
        m.route.set(`/purchase-prices/${encodeId(id)}`);
    },

    onDelete: (vnode, id) => {
        FirebaseModel.delete(id)
            .then(() => {
                PurchasePriceList.loadPurchasePrices(vnode);
            })
            .catch(error => console.error("[Audit][PurchasePriceList] Error deleting purchase price:", error));
    },

    view: vnode => {
        if (vnode.state.loading) {
            return m("div.uk-text-center", "Cargando...");
        }

        const filteredItems = PurchasePriceList.filterItems(vnode);

        return m(Card, { title: "Precios de Compra", useCustomPadding: false }, [
            m(Breadcrumb, { items: [{ name: "Inicio", path: "/" }, { name: "Precios de Compra", path: "/purchase-prices" }] }),
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
                        onClick: () => m.route.set('/purchase-prices/new')
                    })
                ])
            ]),
            m(Table, {
                bind: filteredItems,
                onEdit: id => PurchasePriceList.onEdit(id),
                onDelete: id => PurchasePriceList.onDelete(vnode, id)
            }, [
                m(Text, { label: "Producto", value: "bind.productKey.name" }),
                m(Number, { label: "Precio Unitario", value: "bind.unitPrice" }),
                m(DateInput, { label: "Fecha", value: "bind.date" }),
                m(Text, { label: "Proveedor", value: "bind.supplierKey.tradeName" })
            ]),
            filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
        ]);
    }
};

export default PurchasePriceList;
