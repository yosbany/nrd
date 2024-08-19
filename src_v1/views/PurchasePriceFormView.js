import FirebaseModel from '../models/FirebaseModel.js';
import ValidationModel from '../models/ValidationModel.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import Fila from '../components/base/Fila.js';
import Column from '../components/base/Column.js';
import Button from '../components/base/Button.js';
import Card from '../components/base/Card.js';
import Number from '../components/base/Number.js';
import DatePicker from '../components/base/DatePicker.js';
import Select from '../components/base/Select.js';
import Text from '../components/base/Text.js';
import { decodeId } from '../utils.js';

const PurchasePriceFormView = {
    oninit: async vnode => {
        vnode.state.item = {
            date: new Date()
        };
        vnode.state.errors = {};
        vnode.state.id = decodeId(vnode.attrs.id); 

        if (vnode.state.id) {
            try {
                const data = await FirebaseModel.getById(vnode.state.id, false);
                vnode.state.item = { ...data };
                vnode.state.item.date = vnode.state.item.date ? new Date(vnode.state.item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                m.redraw();
            } catch (error) {
                console.error("[Audit][PurchasePriceFormView] Error loading data:", error);
                m.redraw();
            }
        }
    },

    validateForm: vnode => {
        const errors = ValidationModel.validateEntityData(vnode.state.item, 'PurchasePrices');
        vnode.state.errors = errors;
        return Object.keys(errors).length === 0;
    },

    handleSubmit: async (e, vnode) => {
        e.preventDefault();
        if (PurchasePriceFormView.validateForm(vnode)) {
            try {
                // Guardar el precio de compra
                await FirebaseModel.saveOrUpdate('PurchasePrices', vnode.state.id, vnode.state.item);
                
                // Actualizar el último precio de compra del producto asociado
                const productId = vnode.state.item.productKey;
                if (productId) {
                    const product = await FirebaseModel.getById(productId, false);
                    if (product) {
                        product.lastPurchasePrice = vnode.state.item.unitPrice;
                        await FirebaseModel.saveOrUpdate('Products', productId, product);
                        console.log(`[Audit][PurchasePriceFormView] Last purchase price updated for product ${productId}`);
                    }
                }

                // Redirigir después de guardar
                m.route.set('/purchase-prices');
            } catch (error) {
                vnode.state.errors = { save: error.message };
                m.redraw();
            }
        } else {
            m.redraw();
        }
    },

    loadProductOptions: async () => {
        const products = await FirebaseModel.getAll('Products');
        return products.map(product => ({ id: product.id, display: product.name }));
    },

    loadSupplierOptions: async () => {
        const suppliers = await FirebaseModel.getAll('Suppliers');
        return suppliers.map(supplier => ({ id: supplier.id, display: supplier.tradeName }));
    },

    loadLastPurchasePrice: async (vnode) => {
        const { productKey, supplierKey } = vnode.state.item;
        if (productKey && supplierKey) {
            try {
                const purchasePrices = await FirebaseModel.getAll('PurchasePrices');
                const filteredPrices = purchasePrices
                    .filter(pp => pp.productKey.id === productKey && pp.supplierKey.id === supplierKey)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                
                if (filteredPrices.length > 0) {
                    const lastPrice = filteredPrices[0];
                    vnode.state.item.purchasePackaging = lastPrice.purchasePackaging || "";
                    vnode.state.item.supplierProductCode = lastPrice.supplierProductCode || "";
                    vnode.state.item.unitPrice = lastPrice.unitPrice || 0;
                } else {
                    vnode.state.item.purchasePackaging = "";
                    vnode.state.item.supplierProductCode = "";
                    vnode.state.item.unitPrice = 0;
                }

                // Forzar la actualización del DOM
                m.redraw();
            } catch (error) {
                console.error("[Audit][PurchasePriceFormView] Error loading last purchase price:", error);
            }
        }
    },

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Precios de Compra", path: "/purchase-prices" },
            { name: vnode.state.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: "Precio de Compra", useCustomPadding: false }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    m("form.uk-form-stacked", {
                        onsubmit: e => PurchasePriceFormView.handleSubmit(e, vnode)
                    }, [
                        m("div.uk-margin", [
                            m(DatePicker, {
                                label: "Fecha",
                                value: item.date,
                                onInput: value => item.date = value,
                                error: errors.date
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Select, {
                                label: "Producto",
                                value: item.productKey || "",
                                options: PurchasePriceFormView.loadProductOptions,
                                onChange: async value => {
                                    item.productKey = value;
                                    await PurchasePriceFormView.loadLastPurchasePrice(vnode); // Cargar último precio después de seleccionar el producto
                                },
                                error: errors.productKey
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Select, {
                                label: "Proveedor",
                                value: item.supplierKey || "",
                                options: PurchasePriceFormView.loadSupplierOptions,
                                onChange: async value => {
                                    item.supplierKey = value;
                                    await PurchasePriceFormView.loadLastPurchasePrice(vnode); // Cargar último precio después de seleccionar el proveedor
                                },
                                error: errors.supplierKey
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Select, {
                                label: "Empaque de Compra",
                                value: item.purchasePackaging || "",
                                options: [
                                    { id: "UN", display: "UN" },
                                    { id: "KG", display: "KG" },
                                    { id: "FUNDA", display: "FUNDA" },
                                    { id: "PLANCHA", display: "PLANCHA" },
                                    { id: "CAJON", display: "CAJON" },
                                    { id: "BOLSA", display: "BOLSA" },
                                    { id: "ATADO", display: "ATADO" }
                                ],
                                onChange: value => item.purchasePackaging = value,
                                error: errors.purchasePackaging
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Text, {
                                label: "Código Producto Proveedor",
                                value: item.supplierProductCode || "",
                                onInput: value => item.supplierProductCode = value,
                                error: errors.supplierProductCode
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Number, {
                                label: "Precio Unitario",
                                value: item.unitPrice || 0,
                                onInput: value => item.unitPrice = parseFloat(value),
                                error: errors.unitPrice
                            })
                        ]),
                        m(Fila, { gap: 'small', class: 'uk-flex uk-flex-right' }, [
                            m(Column, { width: 'auto' }, [
                                m(Button, {
                                    type: 'primary',
                                    label: 'Guardar',
                                    onClick: e => PurchasePriceFormView.handleSubmit(e, vnode)
                                })
                            ])
                        ]),
                        errors.save ? m("div.uk-alert-danger", { class: "uk-margin-top" }, errors.save) : null
                    ])
                ])
            ])
        ]);
    }
};

export default PurchasePriceFormView;
