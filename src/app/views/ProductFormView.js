import ProductFormController from '../controllers/ProductFormController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Button from '../../core/ui/Button.js';
import Card from '../../core/ui/Card.js';
import Text from '../../core/ui/Text.js';
import Number from '../../core/ui/Number.js';
import FilterSelect from '../../core/ui/FilterSelect.js'; // Importa FilterSelect
import File from '../../core/ui/File.js';

const ProductFormView = {
    oninit: ProductFormController.oninit,

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;

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
                        onsubmit: e => ProductFormController.handleSubmit(e, vnode)
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
                            m(File, {
                                label: "Imagen",
                                value: item.image || "",
                                onInput: value => item.image = value,
                                onRemove: () => item.image = "",
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
                            m(FilterSelect, { // Reemplaza Select por FilterSelect
                                label: "Proveedor Principal",
                                value: item.preferredSupplierKey || "",
                                options: async () => await ProductFormController.getSupplierOptions(),
                                onChange: value => item.preferredSupplierKey = value,
                                error: errors.preferredSupplierKey,
                                placeholder: "Buscar proveedores..."
                            })
                        ]),
                        // Campos adicionales
                        m("div.uk-margin", [
                            m(FilterSelect, {
                                label: "Sector",
                                value: item.sector || "General",
                                options: [
                                    { id: "Bakery", display: "Bakery" },
                                    { id: "Dairy", display: "Dairy" },
                                    { id: "Meat", display: "Meat" },
                                    { id: "Produce", display: "Produce" },
                                    { id: "Frozen", display: "Frozen" },
                                    { id: "Pantry", display: "Pantry" },
                                    { id: "Beverages", display: "Beverages" },
                                    { id: "General", display: "General" }
                                ],
                                onChange: value => item.sector = value,
                                error: errors.sector
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Number, {
                                label: "Orden en el Sector",
                                value: item.sectorOrder || 0,
                                onInput: value => item.sectorOrder = parseFloat(value),
                                error: errors.sectorOrder
                            })
                        ]),
                        m("div.uk-margin", [
                            m(FilterSelect, {
                                label: "Empaque de Venta",
                                value: item.salesPackaging || "UN",
                                options: [
                                    { id: "UN", display: "UN" },
                                    { id: "KG", display: "KG" },
                                    { id: "FUNDA", display: "FUNDA" },
                                    { id: "PLANCHA", display: "PLANCHA" },
                                    { id: "CAJON", display: "CAJON" },
                                    { id: "BOLSA", display: "BOLSA" },
                                    { id: "ATADO", display: "ATADO" }
                                ],
                                onChange: value => item.salesPackaging = value,
                                error: errors.salesPackaging
                            })
                        ]),
                        m("div.uk-margin", [
                            m("div.uk-card.uk-card-primary.uk-card-body", [
                                m("h3.uk-card-title", "Estadísticas del Producto"),
                                m("p", [
                                    m("span.uk-text-bold", "Última Compra: "),
                                    `$ ${vnode.state.stats.lastPrice ? vnode.state.stats.lastPrice.toFixed(2) : 0.00}`,
                                    " - ",
                                    vnode.state.stats.lastSupplier || "Proveedor no disponible"
                                ]),
                                m("p", [
                                    m("span.uk-text-bold", "Mejor Precio: "),
                                    `$ ${vnode.state.stats.minPrice ? vnode.state.stats.minPrice.toFixed(2) : 0.00}`,
                                    " - ",
                                    vnode.state.stats.minPriceSupplier || "Proveedor no disponible"
                                ]),
                                m("p", [
                                    m("span.uk-text-bold", "Costo Unitario: "),
                                    `$ ${vnode.state.stats.unitCost}`
                                ]),
                                m("p", [
                                    m("span.uk-text-bold", "Precio de Venta (20%): "),
                                    `$ ${vnode.state.stats.salePrice20}`
                                ]),
                                m("p", [
                                    m("span.uk-text-bold", "Precio de Venta (25%): "),
                                    `$ ${vnode.state.stats.salePrice25}`
                                ]),
                                m("p", [
                                    m("span.uk-text-bold", "Precio de Venta (30%): "),
                                    `$ ${vnode.state.stats.salePrice30}`
                                ])
                            ])
                        ]),
                        m(Fila, { gap: 'small', class: 'uk-flex uk-flex-right' }, [
                            m(Column, { width: 'auto' }, [
                                m(Button, {
                                    type: 'primary',
                                    label: 'Guardar',
                                    onClick: e => ProductFormController.handleSubmit(e, vnode)
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
