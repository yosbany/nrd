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

const PurchaseOrderList = {
    oninit: vnode => {
        vnode.state.searchText = '';
        vnode.state.purchaseOrders = [];
        vnode.state.loading = true;

        PurchaseOrderList.loadPurchaseOrders(vnode);
    },

    loadPurchaseOrders: vnode => {
        FirebaseModel.getAll('PurchaseOrders')
            .then(data => {
                vnode.state.purchaseOrders = data.map(order => ({
                    ...order,
                    cantidadProductos: order.products.length // Agregar la cantidad de productos
                }));
                vnode.state.loading = false;
                m.redraw();
            })
            .catch(error => {
                console.error("[Audit][PurchaseOrderList] Error loading purchase orders:", error);
                vnode.state.loading = false;
                m.redraw();
            });
    },

    filterItems: vnode => {
        if (!vnode.state.searchText) return vnode.state.purchaseOrders;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.purchaseOrders.filter(order =>
            Object.values(order).some(value =>
                value && value.toString().toLowerCase().includes(searchText)
            )
        );
    },

    onEdit: id => {
        m.route.set(`/purchase-orders/${encodeId(id)}`);
    },

    onDelete: (vnode, id) => {
        FirebaseModel.delete(id)
            .then(() => {
                PurchaseOrderList.loadPurchaseOrders(vnode);
            })
            .catch(error => console.error("[Audit][PurchaseOrderList] Error deleting purchase order:", error));
    },

    view: vnode => {
        if (vnode.state.loading) {
            return m("div.uk-text-center", "Cargando...");
        }

        const filteredItems = PurchaseOrderList.filterItems(vnode);

        return m(Card, { title: "Órdenes de Compra", useCustomPadding: false }, [
            m(Breadcrumb, { items: [{ name: "Inicio", path: "/" }, { name: "Órdenes de Compra", path: "/purchase-orders" }] }),
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
                        onClick: () => m.route.set('/purchase-orders/new')
                    })
                ])
            ]),
            m(Table, {
                bind: filteredItems,
                onEdit: id => PurchaseOrderList.onEdit(id),
                onDelete: id => PurchaseOrderList.onDelete(vnode, id)
            }, [
                m(DateInput, { label: "Fecha de Orden", value: "bind.orderDate" }),
                m(Text, { label: "Proveedor", value: "bind.supplierKey.tradeName" }),
                m(Text, { label: "Estado", value: "bind.status" }),
                m(Number, { label: "Productos", value: "bind.cantidadProductos" })
            ]),
            filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
        ]);
    }
};

export default PurchaseOrderList;
