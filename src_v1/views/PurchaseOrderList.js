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
import LoadingSpinner from '../components/LoadingSpinner.js';
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
                vnode.state.purchaseOrders = data
                    .map(order => ({
                        ...order,
                        cantidadProductos: order.products.length // Agregar la cantidad de productos
                    }))
                    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)); // Ordenar por fecha descendente
                
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

    onCompleteOrder: async (vnode, order) => {
        if (order) {
            vnode.state.selectedOrder = order;
            vnode.state.showModal = true;
            vnode.state.orderText = "Generando el texto de la orden..."; // Limpiar el textarea
            m.redraw(); // Forzar el redibujado para mostrar el mensaje
    
            // Generar el texto de la orden después de mostrar el mensaje
            vnode.state.orderText = await PurchaseOrderList.generateOrderText(order);
        } else {
            console.warn("[Audit][PurchaseOrderList] Orden seleccionada es nula o indefinida.");
            vnode.state.showModal = false;
        }
        m.redraw();
    },

    generateOrderText: async order => {
        if (!order) return "No hay datos disponibles para la orden seleccionada.";
    
        const supplier = order.supplierKey?.tradeName || "Proveedor desconocido";
        const orderDate = new Date(order.orderDate).toLocaleDateString();
    
        // Cargar todos los precios de compra
        const allPurchasePrices = await FirebaseModel.getAll('PurchasePrices');
    
        const productsList = await Promise.all(order.products.map(async product => {
            // Filtrar los precios de compra relevantes para el producto y el proveedor
            const relevantPrices = allPurchasePrices
                .filter(price => 
                    price.productKey.id === product.productKey.id &&
                    price.supplierKey.id === order.supplierKey.id
                )
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por fecha descendente
    
            const lastPurchasePrice = relevantPrices.length > 0 ? relevantPrices[0] : null;
    
            // Crear la lista de detalles del producto
            const productDetails = [
                product.quantity,
                lastPurchasePrice?.purchasePackaging && lastPurchasePrice?.purchasePackaging !== "UN" ? lastPurchasePrice?.purchasePackaging + " DE" : "",
                product.productKey?.name || "Producto desconocido",
                lastPurchasePrice?.supplierProductCode ? `(${lastPurchasePrice.supplierProductCode})` : "",
            ].filter(detail => detail).join(' ').toUpperCase();
    
            return `• ${productDetails}`;
        }));
    
        return `${supplier}\nFecha: ${orderDate}\n\n${productsList.join('\n')}`;
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            // Obtener la orden desde Firebase sin referencias
            const order = await FirebaseModel.getById(orderId, false);
            if (!order) {
                console.error("[Audit][PurchaseOrderList] Orden no encontrada:", orderId);
                return;
            }

            // Actualizar el estado de la orden
            order.status = status;
    
            await FirebaseModel.saveOrUpdate('PurchaseOrders', orderId, order);
            console.log(`[Audit][PurchaseOrderList] Orden actualizada a ${status}:`, order);
        } catch (error) {
            console.error("[Audit][PurchaseOrderList] Error updating order status:", error);
        }
    },

    printOrder: async (vnode, order) => {
        await PurchaseOrderList.updateOrderStatus(order.id, "Aprobada");
        vnode.state.showModal = false; // Cerrar el modal
        await PurchaseOrderList.loadPurchaseOrders(vnode); // Recargar la tabla

        const printContent = document.getElementById("order-textarea").value;
        const newWindow = window.open("", "_blank");

        newWindow.document.write(`
            <html>
                <head>
                    <style>
                        body {
                            width: 80mm;
                            font-size: 10pt;
                            font-family: Arial, sans-serif;
                        }
                        pre {
                            white-space: pre-wrap; /* Mantener saltos de línea */
                            word-wrap: break-word; /* Ajustar palabras largas */
                        }
                    </style>
                </head>
                <body>
                    <pre>${printContent}</pre>
                </body>
            </html>
        `);

        newWindow.document.close();
        newWindow.print();
        newWindow.close();
    },

    sendOrder: async (vnode, order) => {
        await PurchaseOrderList.updateOrderStatus(order.id, "Aprobada");
        vnode.state.showModal = false; // Cerrar el modal
        await PurchaseOrderList.loadPurchaseOrders(vnode); // Recargar la tabla

        const phoneNumber = order.supplierKey?.phone || "";
        const orderText = vnode.state.orderText;
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderText)}`;
        window.open(whatsappURL, '_blank');
        console.log("[Audit][PurchaseOrderList] Orden enviada por WhatsApp:", order);
    },

    view: vnode => {
        const filteredItems = PurchaseOrderList.filterItems(vnode);

        return [
            m(LoadingSpinner, { loading: vnode.state.loading }),
            m(Card, { title: "Órdenes de Compra", useCustomPadding: false }, [
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
                    m(Number, { label: "Productos", value: "bind.cantidadProductos", format: "integrer" }),
                    m(Text, { label: "Estado", value: "bind.status" }),
                    m(Number, { label: "Importe", value: "bind.totalAmount", format: "currency" }),
                ]),
                vnode.state.showModal && m(Modal, {
                    show: vnode.state.showModal,
                    title: "Completar Orden",
                    onClose: () => vnode.state.showModal = false,
                    content: vnode.state.selectedOrder 
                        ? m("textarea.uk-textarea", {
                            id: "order-textarea",
                            rows: 10,
                            readonly: true,
                            value: vnode.state.orderText || "Generando el texto de la orden..."
                        })
                        : "No hay datos disponibles para la orden seleccionada."
                }, [
                    m("div.uk-text-small.uk-margin-small-bottom", { style: { textAlign: "right" } }, vnode.state.selectedOrder?.supplierKey?.phone || "Número no disponible"),
                    m("div.uk-flex.uk-flex-right.uk-margin-top", [
                        m(Button, {
                            label: "Imprimir",
                            onClick: () => PurchaseOrderList.printOrder(vnode, vnode.state.selectedOrder),
                            style: { marginLeft: "10px" },
                        }),
                        m(Button, {
                            label: "Enviar",
                            type: "primary",
                            style: { marginLeft: "10px" },
                            onClick: () => PurchaseOrderList.sendOrder(vnode, vnode.state.selectedOrder)
                        })
                    ])
                ])
            ]),
            !vnode.state.loading && filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
        ];
    }
};

export default PurchaseOrderList;
