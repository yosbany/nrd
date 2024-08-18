import FirebaseModel from '../models/FirebaseModel.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import Fila from '../components/base/Fila.js';
import Column from '../components/base/Column.js';
import Button from '../components/base/Button.js';
import Card from '../components/base/Card.js';
import Number from '../components/base/Number.js';
import Text from '../components/base/Text.js';
import { decodeId } from '../utils.js';

const PurchaseOrderFormView = {
    oninit: async vnode => {
        vnode.state.products = [];
        vnode.state.errors = {};
        vnode.state.supplierOptions = [];
        vnode.state.quantities = {}; // Guardar cantidades para cada producto
        vnode.state.id = decodeId(vnode.attrs.id);

        // Cargar los productos al iniciar
        try {
            const products = await FirebaseModel.getAll('Products');
            vnode.state.products = products;
            m.redraw();
        } catch (error) {
            console.error("[Audit][PurchaseOrderFormView] Error loading products:", error);
            m.redraw();
        }
    },

    handleSubmit: async (e, vnode, productId) => {
        e.preventDefault();
        const quantity = vnode.state.quantities[productId] || 0;
        if (quantity > 0) {
            try {
                const orderItem = {
                    productKey: productId,
                    quantity: quantity,
                    orderDate: new Date().toISOString(),
                };
                await FirebaseModel.saveOrUpdate('PurchaseOrders', null, orderItem);
                m.route.set('/purchase-orders');
            } catch (error) {
                console.error("[Audit][PurchaseOrderFormView] Error saving order:", error);
                vnode.state.errors[productId] = { save: error.message };
                m.redraw();
            }
        } else {
            vnode.state.errors[productId] = { quantity: "La cantidad debe ser mayor que cero." };
            m.redraw();
        }
    },

    view: vnode => {
        const products = vnode.state.products;
        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Órdenes de Compra", path: "/purchase-orders" },
            { name: "Nueva Orden", path: m.route.get() }
        ];

        return m(Card, { title: "Orden de Compra", useCustomPadding: false }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m("div.uk-position-relative.uk-visible-toggle.uk-light", { tabindex: "-1", "uk-slider": "" }, [
                m("div.uk-slider-items.uk-grid", 
                    products.map(product => 
                        m("div.uk-width-1-1", { key: product.id }, [ // Tarjeta ocupa todo el ancho, centrada
                            m("div.uk-panel.uk-background-muted", { style: { padding: "20px", borderRadius: "8px", minHeight: "300px" } }, [
                                m("div.uk-position-center.uk-text-center", [
                                    m("h2", { "uk-slider-parallax": "x: 100,-100", style: { color: "#4a4a4a" } }, product.name), // Texto en gris oscuro
                                    m("p", { "uk-slider-parallax": "x: 200,-200", style: { color: "#4a4a4a" } }, [
                                        `Precio Unitario: ${product.price.toFixed(2)}`,
                                        m("br"),
                                        `Stock Mínimo: ${product.minimumStock}`,
                                        m("br"),
                                        `Stock Deseado: ${product.desiredStock}`
                                    ]),
                                    m(Number, {
                                        label: "Cantidad a Pedir",
                                        value: vnode.state.quantities[product.id] || 0,
                                        onInput: value => vnode.state.quantities[product.id] = parseInt(value)
                                    }),
                                    vnode.state.errors[product.id]?.quantity && 
                                        m("div.uk-text-danger", vnode.state.errors[product.id].quantity),
                                    m(Button, {
                                        type: 'primary',
                                        label: 'Agregar',
                                        onClick: e => PurchaseOrderFormView.handleSubmit(e, vnode, product.id)
                                    }),
                                    vnode.state.errors[product.id]?.save && 
                                        m("div.uk-alert-danger.uk-margin-top", vnode.state.errors[product.id].save)
                                ])
                            ])
                        ])
                    )
                ),
                // Flechas de navegación
                m("a.uk-position-center-left.uk-position-small", { href: "#", "uk-slidenav-previous": "", "uk-slider-item": "previous" }),
                m("a.uk-position-center-right.uk-position-small", { href: "#", "uk-slidenav-next": "", "uk-slider-item": "next" })
            ])
        ]);
    }
};

export default PurchaseOrderFormView;
