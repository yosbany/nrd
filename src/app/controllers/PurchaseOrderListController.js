import PurchaseOrderModel from '../models/PurchaseOrdersModel.js';
import PurchasePriceModel from '../models/PurchasePricesModel.js';
import Logger from '../utils/Logger.js';
import { encodeId } from '../utils/Helpers.js';
import ProductsModel from '../models/ProductsModel.js';

const PurchaseOrderListController = {
    async oninit(vnode) {
        vnode.state.searchText = '';
        vnode.state.purchaseOrders = [];
        vnode.state.loading = true;
        vnode.state.selectedOrder = null;
        vnode.state.showModal = false;

        await PurchaseOrderListController.loadPurchaseOrders(vnode);
    },

    async loadPurchaseOrders(vnode) {
        try {
            const data = await PurchaseOrderModel.findAll();
            vnode.state.purchaseOrders = data
                .map(order => ({
                    ...order,
                    cantidadProductos: order.products.length 
                }))
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                
            vnode.state.loading = false;
            m.redraw();
        } catch (error) {
            Logger.error("[Audit][PurchaseOrderListController] Error loading purchase orders:", error);
            vnode.state.loading = false;
            m.redraw();
        }
    },

    filterItems(vnode) {
        if (!vnode.state.searchText) return vnode.state.purchaseOrders;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.purchaseOrders.filter(order =>
            Object.values(order).some(value =>
                value && value.toString().toLowerCase().includes(searchText)
            )
        );
    },

    onEdit(id) {
        m.route.set(`/purchase-orders/${encodeId(id)}`);
    },

    async onDelete(vnode, id) {
        try {
            await PurchaseOrderModel.delete(id);
            await PurchaseOrderListController.loadPurchaseOrders(vnode);
        } catch (error) {
            Logger.error("[Audit][PurchaseOrderListController] Error deleting purchase order:", error);
        }
    },

    async onCompleteOrder(vnode, order) {
        if (order) {
            vnode.state.selectedOrder = order;
            vnode.state.showModal = true;
            vnode.state.orderText = "Generando el texto de la orden..."; 
            m.redraw();

            vnode.state.orderText = await PurchaseOrderListController.generateOrderText(order);
        } else {
            Logger.warn("[Audit][PurchaseOrderListController] Orden seleccionada es nula o indefinida.");
            vnode.state.showModal = false;
        }
        m.redraw();
    },

    async generateOrderText(order) {
        if (!order) return "No hay datos disponibles para la orden seleccionada.";
    
        const supplier = order.supplier?.tradeName || "Proveedor desconocido";
        const orderDate = new Date(order.orderDate).toLocaleDateString();
    
        const productsList = await Promise.all(order.products.map(async product => {
            // Obtener el producto completo utilizando el productKey
            const fullProduct = await ProductsModel.findById(product.productKey);
    
            const relevantPriceHistory = fullProduct.purchasePriceHistory
                .filter(history => 
                    history.supplierKey === order.supplierKey
                )
                .sort((a, b) => b.date - a.date);
            console.error("relevantPriceHistory",relevantPriceHistory)
            const lastPurchasePrice = relevantPriceHistory.length > 0 ? relevantPriceHistory[0] : null;
                
            const productDetails = [
                product.quantity,
                lastPurchasePrice?.purchasePackaging && lastPurchasePrice?.purchasePackaging !== "UN" ? lastPurchasePrice?.purchasePackaging + " DE" : "",
                lastPurchasePrice?.supplierProductName || fullProduct.name || "Producto desconocido", // Usar nombre del producto si no hay supplierProductName
                lastPurchasePrice?.supplierProductCode ? `(${lastPurchasePrice.supplierProductCode})` : "", // No mostrar si no hay supplierProductCode
            ].filter(detail => detail).join(' ').toUpperCase();
    
            return `• ${productDetails}`;
        }));
    
        return `${supplier}\nFecha: ${orderDate}\n\n${productsList.join('\n')}`;
    },

    async updateOrderStatus(orderId, status) {
        try {
            const order = await PurchaseOrderModel.findById(orderId);
            if (!order) {
                Logger.error("[Audit][PurchaseOrderListController] Orden no encontrada:", orderId);
                return;
            }

            order.status = status;
    
            await PurchaseOrderModel.save(orderId, order);
            Logger.info(`[Audit][PurchaseOrderListController] Orden actualizada a ${status}:`, order);
        } catch (error) {
            Logger.error("[Audit][PurchaseOrderListController] Error updating order status:", error);
        }
    },

    async printOrder(vnode, order) {
        await this.updateOrderStatus(order.id, "Aprobada");
        vnode.state.showModal = false;
        await this.loadPurchaseOrders(vnode);

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
                            white-space: pre-wrap;
                            word-wrap: break-word;
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

    async sendOrder(vnode, order) {
        await PurchaseOrderListController.updateOrderStatus(order.id, "Aprobada");
        vnode.state.showModal = false;
        await PurchaseOrderListController.loadPurchaseOrders(vnode);

        const phoneNumber = order.supplier?.phone || "";
        const orderText = vnode.state.orderText;
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderText)}`;
        window.open(whatsappURL, '_blank');
        Logger.info("[Audit][PurchaseOrderListController] Orden enviada por WhatsApp:", order);
    }
};

export default PurchaseOrderListController;
