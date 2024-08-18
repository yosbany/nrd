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
import { decodeId } from '../utils.js';

const PurchasePriceFormView = {
    oninit: async vnode => {
        vnode.state.item = {};
        vnode.state.errors = {};
        vnode.state.id = decodeId(vnode.attrs.id); 

        if (vnode.state.id) {
            try {
                const data = await FirebaseModel.getById(vnode.state.id, false);
                vnode.state.item = { ...data };
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
                await FirebaseModel.saveOrUpdate('PurchasePrices', vnode.state.id, vnode.state.item);
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

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Precios de Compra", path: "/purchase-prices" },
            { name: vnode.state.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: "Formulario de Precio de Compra", useCustomPadding: false }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    m("form.uk-form-stacked", {
                        onsubmit: e => PurchasePriceFormView.handleSubmit(e, vnode)
                    }, [
                        m("div.uk-margin", [
                            m(DatePicker, {
                                label: "Fecha",
                                value: item.date || new Date(),
                                onInput: value => item.date = value,
                                error: errors.date
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Select, {
                                label: "Producto",
                                value: item.productKey || "",
                                options: PurchasePriceFormView.loadProductOptions,
                                onChange: value => item.productKey = value,
                                error: errors.productKey
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Select, {
                                label: "Proveedor",
                                value: item.supplierKey || "",
                                options: PurchasePriceFormView.loadSupplierOptions,
                                onChange: value => item.supplierKey = value,
                                error: errors.supplierKey
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
