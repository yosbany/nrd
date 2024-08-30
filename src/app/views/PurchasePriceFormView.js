import PurchasePriceFormController from '../controllers/PurchasePriceFormController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Button from '../../core/ui/Button.js';
import Card from '../../core/ui/Card.js';
import Number from '../../core/ui/Number.js';
import DatePicker from '../../core/ui/DatePicker.js';
import FilterSelect from '../../core/ui/FilterSelect.js';
import Text from '../../core/ui/Text.js';

const PurchasePriceFormView = {
    oninit: PurchasePriceFormController.oninit,

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
                        onsubmit: e => PurchasePriceFormController.handleSubmit(e, vnode)
                    }, [
                        m("div.uk-margin", [
                            m(DatePicker, {
                                label: "Fecha",
                                value: item.date || new Date(),
                                onInput: value => item.date = value,
                                error: errors.date,
                                required: true
                            })
                        ]),
                        m("div.uk-margin", [
                            m(FilterSelect, {
                                label: "Producto",
                                value: item.productKey || "",
                                options: async () => await PurchasePriceFormController.getProductsOptions(),
                                onChange: async value => {
                                    item.productKey = value;
                                    await PurchasePriceFormController.loadLastPurchasePrice(vnode);
                                    await PurchasePriceFormController.updateConversionLabel(vnode);
                                },
                                error: errors.productKey,
                                required: true,
                                placeholder: "Buscar productos..."
                            })
                        ]),
                        m("div.uk-margin", [
                            m(FilterSelect, {
                                label: "Proveedor",
                                value: item.supplierKey || "",
                                options: async () => await PurchasePriceFormController.getSupplierOptions(),
                                onChange: async value => {
                                    item.supplierKey = value;
                                    await PurchasePriceFormController.loadLastPurchasePrice(vnode);
                                },
                                error: errors.supplierKey,
                                required: true,
                                placeholder: "Buscar proveedores..."
                            })
                        ]),
                        // Card para los campos relacionados con el proveedor
                        m(Card, { title: "Información del Proveedor", type: 'primary' }, [
                            m("div.uk-margin", [
                                m(Text, {
                                    label: "Nombre Producto Proveedor",
                                    value: item.supplierProductName || "",
                                    onInput: value => item.supplierProductName = value,
                                    error: errors.supplierProductName,
                                    required: false
                                })
                            ]),
                            m("div.uk-margin", [
                                m(Text, {
                                    label: "Código Producto Proveedor",
                                    value: item.supplierProductCode || "",
                                    onInput: value => item.supplierProductCode = value,
                                    error: errors.supplierProductCode,
                                    required: false
                                })
                            ]),
                            m("div.uk-margin", [
                                m(FilterSelect, {
                                    label: "Empaque de Compra",
                                    value: item.purchasePackaging || "UN",
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
                                    error: errors.purchasePackaging,
                                    required: true,
                                    placeholder: "Seleccionar empaque..."
                                })
                            ]),
                            m("div.uk-margin", [
                                m(Number, {
                                    label: vnode.state.conversionLabel, // Usar el label dinámico
                                    value: item.packagingConversion || 1,
                                    onInput: value => item.packagingConversion = parseFloat(value),
                                    error: errors.packagingConversion,
                                    required: true,
                                    min: 0.001
                                })
                            ])
                            
                        ]),
                        m("div.uk-margin", [
                            m(Number, {
                                label: "Precio Unitario",
                                value: item.unitPrice || 0,
                                onInput: value => item.unitPrice = parseFloat(value),
                                error: errors.unitPrice,
                                required: true
                            })
                        ]),
                        m(Fila, { gap: 'small', class: 'uk-flex uk-flex-right' }, [
                            m(Column, { width: 'auto' }, [
                                m(Button, {
                                    type: 'primary',
                                    label: 'Guardar',
                                    onClick: e => PurchasePriceFormController.handleSubmit(e, vnode)
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
