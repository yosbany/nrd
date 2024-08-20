import FirebaseModel from '../models/FirebaseModel.js';
import ValidationModel from '../models/ValidationModel.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import Fila from '../components/base/Fila.js';
import Column from '../components/base/Column.js';
import Button from '../components/base/Button.js';
import Card from '../components/base/Card.js';
import Text from '../components/base/Text.js';
import Number from '../components/base/Number.js';
import Select from '../components/base/Select.js';
import { decodeId } from '../utils.js';

const ProductFormView = {
    oninit: async vnode => {  
        vnode.state.item = {};
        vnode.state.errors = {};
        vnode.state.suppliers = [];
        vnode.state.supplierOptions = [];
        vnode.state.id = decodeId(vnode.attrs.id);  

        if (vnode.attrs.id) {
            try {
                const data = await FirebaseModel.getById(vnode.state.id, false);
                vnode.state.item = { ...data };
                m.redraw();
            } catch (error) {
                console.error("[Audit][ProductFormView] Error loading data:", error);
                m.redraw();
            }
        }

        // Cargar las opciones de proveedores al iniciar
        try {
            const suppliers = await ProductFormView.loadSupplierOptions();
            vnode.state.suppliers = suppliers; 
            vnode.state.supplierOptions = suppliers.map(supplier => ({ id: supplier.id, display: supplier.tradeName }));
            m.redraw();
        } catch (error) {
            console.error("[Audit][ProductFormView] Error loading suppliers:", error);
            m.redraw();
        }
    },

    validateForm: vnode => {
        const errors = ValidationModel.validateEntityData(vnode.state.item, 'Products');
        vnode.state.errors = errors;
        return Object.keys(errors).length === 0;
    },

    handleSubmit: async (e, vnode) => {
        e.preventDefault();
        if (ProductFormView.validateForm(vnode)) {
            try {
                await FirebaseModel.saveOrUpdate('Products', vnode.state.id, vnode.state.item);
                m.route.set('/products');
            } catch (error) {
                vnode.state.errors = { save: error.message };
                m.redraw();
            }
        } else {
            m.redraw();
        }
    },

    loadSupplierOptions: async () => {
        // Función que carga las opciones de proveedores desde Firebase
        const suppliers = await FirebaseModel.getAll('Suppliers');
        return suppliers.map(supplier => ({ id: supplier.id, display: supplier.tradeName }));
    },

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;
        const supplierOptions = vnode.state.supplierOptions;

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/products" },
            { name: vnode.state.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: "Producto", useCustomPadding: false }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    m("form.uk-form-stacked", {
                        onsubmit: e => ProductFormView.handleSubmit(e, vnode)
                    }, [
                        m("div.uk-margin", [
                            m(Text, {
                                label: "SKU",
                                value: item.sku || "",
                                onInput: value => item.sku = value,
                                error: errors.sku
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Text, {
                                label: "Nombre",
                                value: item.name || "",
                                onInput: value => item.name = value,
                                error: errors.name
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Text, {
                                label: "Imagen",
                                value: item.image || "",
                                onInput: value => item.image = value,
                                error: errors.image
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Number, {
                                label: "Stock Deseado",
                                value: item.desiredStock || 0,
                                onInput: value => item.desiredStock = parseFloat(value),
                                error: errors.desiredStock
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Number, {
                                label: "Stock Mínimo",
                                value: item.minimumStock || 0,
                                onInput: value => item.minimumStock = parseFloat(value),
                                error: errors.minimumStock
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Select, {
                                label: "Proveedor Preferido",
                                value: item.preferredSupplierKey || "",
                                options: ProductFormView.loadSupplierOptions,
                                onChange: value => item.preferredSupplierKey = value,
                                error: errors.preferredSupplierKey
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Text, {
                                label: "Último Precio de Compra",
                                value: item.lastPurchasePrice ? item.lastPurchasePrice.toFixed(2) : "N/A",
                                outputMode: true
                            })
                        ]),
                        m(Fila, { gap: 'small', class: 'uk-flex uk-flex-right' }, [
                            m(Column, { width: 'auto' }, [
                                m(Button, {
                                    type: 'primary',
                                    label: 'Guardar',
                                    onClick: e => ProductFormView.handleSubmit(e, vnode)
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

export default ProductFormView;
