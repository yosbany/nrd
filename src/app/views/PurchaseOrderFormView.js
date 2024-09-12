import PurchaseOrderFormController from '../controllers/PurchaseOrderFormController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import Button from '../../core/ui/Button.js';
import Select from '../../core/ui/Select.js';
import TextInput from '../../core/ui/Text.js';
import Number from '../../core/ui/Number.js';
import Carousel from '../../core/ui/Carousel.js';
import LoadingSpinner from '../views/partials/Loading.js';
import Card from '../../core/ui/Card.js';

const PurchaseOrderFormView = {
    oninit: PurchaseOrderFormController.oninit,

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Órdenes de Compra", path: "/purchase-orders" },
            { name: vnode.state.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        const formatNumber = (value) => {
            const options = {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            };
            return parseFloat(value).toLocaleString('es-ES', options);
        };

        return m(Card, { title: "Orden de Compra", useCustomPadding: true }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            vnode.state.isLoading 
                ? m(LoadingSpinner, { loading: vnode.state.isLoading })  
                : [
                    m("div.uk-margin", [
                        m("div.uk-grid-small", { "uk-grid": true }, [
                            m("div.uk-width-1-2", [
                                m(Select, {
                                    label: "Proveedor",
                                    value: item.supplierKey,
                                    options: async () => await PurchaseOrderFormController.getSupplierOptions(),
                                    onChange: value => PurchaseOrderFormController.handleSupplierChange(vnode, value),
                                    error: errors.supplierKey
                                }),
                            ]),
                            m("div.uk-width-1-2", [
                                m(Select, {
                                    label: "Estado",
                                    value: item.status,
                                    options: [
                                        { id: "Pendiente", display: "Pendiente" },
                                        { id: "Aprobada", display: "Aprobada" },
                                        { id: "Cancelada", display: "Cancelada" }
                                    ],
                                    onChange: value => {
                                        vnode.state.item.status = value;
                                        vnode.state.isModified = true;
                                    },
                                    error: errors.status
                                }),
                            ]),
                        ]),
                        vnode.state.item.supplierKey && m(TextInput, {
                            value: vnode.state.searchText,
                            onInput: value => {
                                vnode.state.searchText = value;
                                PurchaseOrderFormController.handleProductSearch(vnode);
                            },
                            placeholder: "Buscar productos...",
                            showLabel: false
                        })
                    ]),
                    vnode.state.item.supplierKey && vnode.state.filteredProducts.length > 0 && m(Carousel, {},
                        vnode.state.filteredProducts.map((product, index) => 
                            m("div", [
                                m("h2", product.display),
                                m("div.uk-card.uk-card-primary", [
                                    m("div.uk-card-header", m("h3.uk-card-title", "Detalles Proveedor")),
                                    m("div.uk-card-body", [
                                        m("form.uk-form-horizontal", [
                                            m("div.uk-margin-small", [
                                                m("label.uk-form-label", "Código: "),
                                                m("div.uk-form-controls", 
                                                    m("span", product.supplierProductCode || "N/A")
                                                )
                                            ]),
                                            m("div.uk-margin-small", [
                                                m("label.uk-form-label", "Nombre: "),
                                                m("div.uk-form-controls", 
                                                    m("span", product.supplierProductName || "N/A")
                                                )
                                            ]),
                                            m("div.uk-margin-small", [
                                                m("label.uk-form-label", "Precio de Compra: "),
                                                m("div.uk-form-controls", 
                                                    m("span", product.unitPrice ? `$ ${formatNumber(product.unitPrice)}` : "N/A")
                                                )
                                            ]),
                                            m("div.uk-margin-small", [
                                                m("label.uk-form-label",{
                                                    style: {
                                                        fontSize: "1.2em", // Incrementa el tamaño del texto para hacerlo más visible
                                                        fontWeight: "bold" // Resalta el texto en negrita
                                                    }
                                                }, "Stock Deseado: "),
                                                m("div.uk-form-controls", [
                                                    m("span", {
                                                        style: {
                                                            fontSize: "1.5em", // Incrementa el tamaño del texto para hacerlo más visible
                                                            fontWeight: "bold" // Resalta el texto en negrita
                                                        }
                                                    }, `${formatNumber(product.desiredStock)} ${product.purchasePackaging || 'UN'}`)
                                                ])
                                            ]),
                                        ])
                                    ])
                                ]),
                                m(Number, {
                                    label: "Cantidad a Pedir",
                                    value: vnode.state.item.products.find(p => p.productKey === product.id)?.quantity || product.desiredStock,
                                    onInput: value => {
                                        const productToUpdate = vnode.state.item.products.find(p => p.productKey === product.id);
                                        if (value > 0) {
                                            if (productToUpdate) {
                                                productToUpdate.quantity = value;
                                            } else {
                                                vnode.state.item.products.push({ productKey: product.id, quantity: value });
                                            }
                                            vnode.state.isModified = true;
                                        } else if (productToUpdate) {
                                            vnode.state.item.products = vnode.state.item.products.filter(p => p.productKey !== product.id);
                                        }
                                    },
                                    style: {
                                        width: '120px',
                                        height: '50px',
                                        color: "#333",
                                        backgroundColor: "#fff",
                                        border: "1px solid #ccc",
                                        textAlign: 'center'
                                    }
                                }),
                                m("div.uk-flex.uk-flex-between", [
                                    m(Button, {
                                        class: `uk-button ${vnode.state.item.products.some(p => p.productKey === product.id) ? 'uk-button-default' : 'uk-button-secondary'}`,
                                        label: vnode.state.item.products.some(p => p.productKey === product.id) ? 'Quitar' : 'Agregar',
                                        style: {
                                            width: '120px', 
                                            height: '50px',
                                        },
                                        onClick: () => {
                                            vnode.state.item.products.some(p => p.productKey === product.id)
                                                ? PurchaseOrderFormController.handleProductRemove(vnode, product.id)
                                                : PurchaseOrderFormController.handleProductSubmit(vnode, product.id);
                                            vnode.state.isModified = true;
                                        }
                                    }),
                                    m("p.uk-text-meta", { style: { marginLeft: "10px" } }, `Subtotal: $${formatNumber(product.unitPrice * (vnode.state.item.products.find(p => p.productKey === product.id)?.quantity || product.desiredStock))}`)
                                ]),
                                vnode.state.errors[product.id]?.save && 
                                    m("div.uk-alert-danger.uk-margin-top", vnode.state.errors[product.id].save)
                            ])
                        )
                    ),
                    vnode.state.item.supplierKey && m("div.uk-margin-top.uk-flex.uk-flex-right", [
                        m("div.uk-margin-right.uk-flex.uk-flex-middle", `Importe: $${PurchaseOrderFormController.calculateTotalOrderAmount(vnode)}`),
                        m(Button, {
                            type: 'primary',
                            label: PurchaseOrderFormController.getOrderButtonText(vnode),
                            onClick: e => PurchaseOrderFormController.handleOrderSubmit(e, vnode)
                        })
                    ]),
                    errors.save && m("div.uk-alert-danger.uk-margin-top", errors.save)
                ]
        ]);
    }
};

export default PurchaseOrderFormView;
