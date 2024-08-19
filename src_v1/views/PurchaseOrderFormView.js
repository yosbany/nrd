import FirebaseModel from '../models/FirebaseModel.js';
import ValidationModel from '../models/ValidationModel.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import Button from '../components/base/Button.js';
import Card from '../components/base/Card.js';
import Number from '../components/base/Number.js';
import Select from '../components/base/Select.js';
import TextInput from '../components/base/Text.js';
import { decodeId } from '../utils.js';

const PurchaseOrderFormView = {
    oninit: async vnode => {
        vnode.state.item = {
            supplierKey: "",
            products: [],
            orderDate: new Date(),
            status: "Pendiente" // Estado inicial por defecto
        };
        vnode.state.errors = {};
        vnode.state.products = [];
        vnode.state.filteredProducts = [];
        vnode.state.searchText = "";
        vnode.state.isModified = false;
        vnode.state.id = decodeId(vnode.attrs.id);

        if (vnode.attrs.id) {
            try {
                const data = await FirebaseModel.getById(vnode.state.id, false);
                vnode.state.item = { ...data };
                vnode.state.products = await PurchaseOrderFormView.loadProductOptions(vnode.state.item.supplierKey);
                PurchaseOrderFormView.filterProductsBySupplier(vnode);
                m.redraw();
            } catch (error) {
                console.error("[Audit][PurchaseOrderFormView] Error loading data:", error);
                m.redraw();
            }
        } else {
            try {
                vnode.state.supplierOptions = await PurchaseOrderFormView.loadSupplierOptions();
                vnode.state.products = await PurchaseOrderFormView.loadProductOptions(vnode.state.item.supplierKey);
                vnode.state.filteredProducts = vnode.state.products;
                m.redraw();
            } catch (error) {
                console.error("[Audit][PurchaseOrderFormView] Error loading suppliers and products:", error);
                m.redraw();
            }
        }
    },

    validateForm: vnode => {
        const errors = ValidationModel.validateEntityData(vnode.state.item, 'PurchaseOrders');
        vnode.state.errors = errors;
        return Object.keys(errors).length === 0;
    },

    handleProductSubmit: (vnode, productId) => {
        const existingProduct = vnode.state.item.products.find(p => p.productKey === productId);
        const product = vnode.state.products.find(p => p.id === productId);
        const quantity = vnode.state.item.products.find(p => p.productKey === productId)?.quantity || product.desiredStock;

        if (existingProduct) {
            existingProduct.quantity = quantity;
        } else {
            vnode.state.item.products.push({ productKey: productId, quantity });
        }

        vnode.state.isModified = true;
        m.redraw();
    },

    handleProductRemove: (vnode, productId) => {
        vnode.state.item.products = vnode.state.item.products.filter(p => p.productKey !== productId);
        vnode.state.isModified = true;
        m.redraw();
    },

    handleOrderSubmit: async (e, vnode) => {
        e.preventDefault();
        if (PurchaseOrderFormView.validateForm(vnode)) {
            try {
                await FirebaseModel.saveOrUpdate('PurchaseOrders', vnode.state.id, vnode.state.item);
                vnode.state.isModified = false;
                m.route.set('/purchase-orders');
            } catch (error) {
                vnode.state.errors.save = error.message;
                m.redraw();
            }
        }
    },

    loadSupplierOptions: async () => {
        const suppliers = await FirebaseModel.getAll('Suppliers');
        return suppliers.map(supplier => ({ id: supplier.id, display: supplier.tradeName }));
    },

    loadProductOptions: async supplierKey => {
        const products = await FirebaseModel.getAll('Products');
        const purchasePrices = await FirebaseModel.getAll('PurchasePrices');
        
        return products.map(product => {
            const relevantPrices = purchasePrices
                .filter(price => price.productKey.id === product.id && price.supplierKey.id === supplierKey)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            const lastPurchasePrice = relevantPrices.length > 0 ? relevantPrices[0].unitPrice : "N/A";

            return {
                id: product.id,
                display: product.name,
                price: product.price || 0,
                minimumStock: product.minimumStock || 0,
                desiredStock: product.desiredStock || 0,
                preferredSupplierKey: product.preferredSupplierKey.id,
                lastPurchasePrice
            };
        });
    },

    filterProductsBySupplier: vnode => {
        const supplierKey = vnode.state.item.supplierKey;
        vnode.state.filteredProducts = vnode.state.products.filter(
            product => product.preferredSupplierKey === supplierKey
        );
    },

    handleSupplierChange: async (vnode, supplierKey) => {
        vnode.state.item.supplierKey = supplierKey;
        vnode.state.item.products = []; // Limpiar productos al cambiar proveedor

        vnode.state.products = await PurchaseOrderFormView.loadProductOptions(supplierKey);
        PurchaseOrderFormView.filterProductsBySupplier(vnode);

        vnode.state.isModified = true;
        vnode.state.searchText = "";
        m.redraw();
    },

    handleProductSearch: vnode => {
        const searchText = vnode.state.searchText.toLowerCase();
        const supplierKey = vnode.state.item.supplierKey;

        vnode.state.filteredProducts = vnode.state.products.filter(product =>
            product.preferredSupplierKey === supplierKey && 
            product.display.toLowerCase().includes(searchText)
        );
        m.redraw();
    },

    calculateTotalOrderAmount: vnode => {
        return vnode.state.item.products.reduce((total, product) => {
            const productInfo = vnode.state.products.find(p => p.id === product.productKey);
            return total + (productInfo && productInfo.lastPurchasePrice !== "N/A" ? productInfo.lastPurchasePrice * product.quantity : 0);
        }, 0).toFixed(2);
    },

    getOrderButtonText: vnode => {
        const productCount = vnode.state.item.products.length;
        const modifiedIndicator = vnode.state.isModified ? "*" : "";
        return `${modifiedIndicator}(${productCount}) Guardar Orden`;
    },

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Órdenes de Compra", path: "/purchase-orders" },
            { name: vnode.state.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: "Orden de Compra", useCustomPadding: false }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m("div.uk-margin", [
                m("div.uk-grid-small", { "uk-grid": true }, [
                    m("div.uk-width-1-2", [
                        m(Select, {
                            label: "Proveedor",
                            value: item.supplierKey,
                            options: PurchaseOrderFormView.loadSupplierOptions,
                            onChange: value => {
                                PurchaseOrderFormView.handleSupplierChange(vnode, value);
                            },
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
                m(TextInput, {
                    value: vnode.state.searchText,
                    onInput: value => {
                        vnode.state.searchText = value;
                        PurchaseOrderFormView.handleProductSearch(vnode);
                    },
                    placeholder: "Buscar productos...",
                    showLabel: false
                })
            ]),
            m("div.uk-position-relative.uk-visible-toggle.uk-light", { tabindex: "-1", "uk-slider": "" }, [
                m("div.uk-slider-items.uk-grid", 
                    vnode.state.filteredProducts.map((product, index) => {
                        const isAdded = vnode.state.item.products.some(p => p.productKey === product.id);
                        const cardStyle = isAdded ? { backgroundColor: "#4caf50", color: "#ffffff" } : { backgroundColor: "#007bff", color: "#ffffff" };

                        return m("div.uk-width-1-1@s.uk-width-2-3@m.uk-width-1-2@l", { key: product.id }, [
                            m("div.uk-panel", { style: { ...cardStyle, padding: "20px", borderRadius: "8px", minHeight: "300px", position: "relative" } }, [
                                m("div", { style: { textAlign: "left" } }, [
                                    m("h2", { "uk-slider-parallax": "x: 100,-100" }, product.display),
                                    m("p", { "uk-slider-parallax": "x: 200,-200" }, [
                                        `Precio Unitario: ${product.price.toFixed(2)}`,
                                        m("br"),
                                        `Stock Mínimo: ${product.minimumStock}`,
                                        m("br"),
                                        `Stock Deseado: ${product.desiredStock}`,
                                        m("br"),
                                        `Último Precio de Compra: ${product.lastPurchasePrice !== "N/A" ? `$${product.lastPurchasePrice.toFixed(2)}` : "N/A"}`
                                    ]),
                                    m(Number, {
                                        label: "Cantidad a Pedir",
                                        value: vnode.state.item.products.find(p => p.productKey === product.id)?.quantity || product.desiredStock,
                                        onInput: value => {
                                            const productToUpdate = vnode.state.item.products.find(p => p.productKey === product.id);
                                            if (productToUpdate) {
                                                productToUpdate.quantity = value;
                                            } else {
                                                PurchaseOrderFormView.handleProductSubmit(vnode, product.id);
                                            }
                                            vnode.state.isModified = true;
                                        },
                                        style: { color: "#333", backgroundColor: "#fff", border: "1px solid #ccc" },
                                        id: `quantity-input-${product.id}`,
                                        onfocus: e => {
                                            if (e.target.value == product.desiredStock) {
                                                e.target.value = '';
                                            }
                                        },
                                        onblur: e => {
                                            if (!e.target.value) {
                                                const productToUpdate = vnode.state.item.products.find(p => p.productKey === product.id);
                                                if (productToUpdate) {
                                                    productToUpdate.quantity = product.desiredStock;
                                                    e.target.value = product.desiredStock;
                                                } else {
                                                    e.target.value = product.desiredStock;
                                                }
                                            }
                                        }
                                    }),
                                    vnode.state.errors[product.id]?.quantity && 
                                        m("div.uk-text-danger", vnode.state.errors[product.id].quantity),
                                    m(Button, {
                                        type: 'primary',
                                        label: isAdded ? 'Quitar' : 'Agregar',
                                        onClick: () => {
                                            isAdded
                                                ? PurchaseOrderFormView.handleProductRemove(vnode, product.id)
                                                : PurchaseOrderFormView.handleProductSubmit(vnode, product.id);
                                            vnode.state.isModified = true;
                                        }
                                    }),
                                    vnode.state.errors[product.id]?.save && 
                                        m("div.uk-alert-danger.uk-margin-top", vnode.state.errors[product.id].save)
                                ]),
                                m("div", { style: { position: "absolute", bottom: "10px", right: "10px" } }, `${index + 1}/${vnode.state.filteredProducts.length}`)
                            ])
                        ]);
                    })
                ),
                m("a.uk-position-center-left.uk-position-small", { href: "#", "uk-slidenav-previous": "", "uk-slider-item": "previous" }),
                m("a.uk-position-center-right.uk-position-small", { href: "#", "uk-slidenav-next": "", "uk-slider-item": "next" })
            ]),
            m("div.uk-margin-top.uk-flex.uk-flex-right", [
                m("div.uk-margin-right.uk-flex.uk-flex-middle", `Importe Total: $${PurchaseOrderFormView.calculateTotalOrderAmount(vnode)}`),
                m(Button, {
                    type: 'primary',
                    label: PurchaseOrderFormView.getOrderButtonText(vnode),
                    onClick: e => PurchaseOrderFormView.handleOrderSubmit(e, vnode)
                })
            ]),
            errors.save && m("div.uk-alert-danger.uk-margin-top", errors.save)
        ]);
    }
};

export default PurchaseOrderFormView;
