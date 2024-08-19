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
import Modal from '../components/base/Modal.js';
import { encodeId } from '../utils.js';

const PurchaseOrderList = {
    oninit: vnode => {
        vnode.state.searchText = '';
        vnode.state.purchaseOrders = [];
        vnode.state.loading = true;
        vnode.state.selectedOrder = null;
        vnode.state.showModal = false;

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

    onCompleteOrder: (vnode, order) => {
        if (order) {
            vnode.state.selectedOrder = order;
            vnode.state.showModal = true;
        } else {
            console.warn("[Audit][PurchaseOrderList] Orden seleccionada es nula o indefinida.");
            vnode.state.showModal = false;
        }
        m.redraw();
    },

    generateOrderText: order => {
        if (!order) return "No hay datos disponibles para la orden seleccionada.";

        const supplier = order.supplierKey?.tradeName || "Proveedor desconocido";
        const orderDate = new Date(order.orderDate).toLocaleDateString();
        const productsList = order.products.map(product => 
            `• ${product.quantity} x ${product.productKey?.name || "Producto desconocido"}`
        ).join('\n');

        return `Proveedor: ${supplier}\nFecha: ${orderDate}\n\nProductos:\n${productsList}`;
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
                onDelete: id => PurchaseOrderList.onDelete(vnode, id),
                additionalActions: [
                    {
                        icon: 'check',
                        title: 'Completar Orden',
                        style: { backgroundColor: 'lightgreen' },
                        onClick: order => PurchaseOrderList.onCompleteOrder(vnode, order)
                    }
                ]
            }, [
                m(DateInput, { label: "Fecha de Orden", value: "bind.orderDate" }),
                m(Text, { label: "Proveedor", value: "bind.supplierKey.tradeName" }),
                m(Text, { label: "Estado", value: "bind.status" }),
                m(Number, { label: "Productos", value: "bind.cantidadProductos" })
            ]),
            vnode.state.showModal && m(Modal, {
                show: vnode.state.showModal,
                title: "Completar Orden",
                onClose: () => vnode.state.showModal = false,
                content: vnode.state.selectedOrder 
                    ? m("textarea.uk-textarea", {
                        rows: 10,
                        readonly: true,
                        value: PurchaseOrderList.generateOrderText(vnode.state.selectedOrder)
                    })
                    : "No hay datos disponibles para la orden seleccionada."
            }, [
                vnode.state.selectedOrder && [
                    m(Button, {
                        label: "Imprimir",
                        onClick: () => {
                            vnode.state.showModal = false;
                            console.log("[Audit][PurchaseOrderList] Orden impresa:", vnode.state.selectedOrder);
                        }
                    }),
                    m(Button, {
                        label: "Enviar por WhatsApp",
                        type: "primary",
                        onClick: () => {
                            const phoneNumber = vnode.state.selectedOrder.supplierKey?.phone || "";
                            const orderText = PurchaseOrderList.generateOrderText(vnode.state.selectedOrder);
                            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderText)}`;
                            window.open(whatsappURL, '_blank');
                            vnode.state.showModal = false;
                            console.log("[Audit][PurchaseOrderList] Orden enviada por WhatsApp:", vnode.state.selectedOrder);
                        }
                    })
                ]
            ]),
            filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
        ]);
    }
};

export default PurchaseOrderList;
