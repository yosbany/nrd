import PurchaseOrderModel from '../models/PurchaseOrdersModel.js';
import ProductModel from '../models/ProductsModel.js';
import Logger from '../utils/Logger.js';
import { decodeId } from '../utils/Helpers.js';
import SuppliersModel from '../models/SuppliersModel.js';

const PurchaseOrderFormController = {
    async oninit(vnode) {
        vnode.state.item = {};
        vnode.state.isLoading = true;
        vnode.state.errors = {};
        vnode.state.products = [];
        vnode.state.filteredProducts = [];
        vnode.state.searchText = "";
        vnode.state.isModified = false;
        vnode.state.id = decodeId(vnode.attrs.id);

        try {
            vnode.state.supplierOptions = await PurchaseOrderFormController.getSupplierOptions();

            if (vnode.attrs.id) {
                vnode.state.item = await PurchaseOrderModel.findById(vnode.state.id);
                if (vnode.state.item.supplierKey) {
                    vnode.state.products = await PurchaseOrderFormController.loadProductOptions(vnode.state.item.supplierKey);
                    PurchaseOrderFormController.filterProductsBySupplier(vnode);
                    Logger.warn("[Audit][PurchaseOrderFormController] Loading data findById:", vnode.state.item);
                }
            } else {
                vnode.state.item = await PurchaseOrderModel.createDefaultInstance();
                Logger.warn("[Audit][PurchaseOrderFormController] Loading data createDefaultInstance:", vnode.state.item);
                m.redraw();
            }
        } catch (error) {
            Logger.error("[Audit][PurchaseOrderFormController] Error loading data:", error);
        } finally {
            vnode.state.isLoading = false;
            m.redraw();
        }
    },

    async getSupplierOptions() {
        return await SuppliersModel.getOptionsKeyValue();
    },

    async loadProductOptions(supplierKey) {
        const products = await ProductModel.findAll();
        return products.filter(product => product.preferredSupplierKey === supplierKey).map(product => {
            const relevantPrices = product.purchasePriceHistory
                .filter(price => price.supplierKey === supplierKey)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            const lastPurchasePrice = relevantPrices.length > 0 ? relevantPrices[0] : null;

            return {
                id: product.id,
                display: product.name,
                supplierProductName: lastPurchasePrice?.supplierProductName || product.name,
                supplierProductCode: lastPurchasePrice?.supplierProductCode || "",
                unitPrice: lastPurchasePrice?.unitPrice || product.unitSalesCost,
                desiredStock: product.desiredStock
            };
        });
    },

    filterProductsBySupplier(vnode) {
        const supplierKey = vnode.state.item.supplierKey;
        vnode.state.filteredProducts = supplierKey ? vnode.state.products : [];
        m.redraw();
    },

    async handleSupplierChange(vnode, supplierKey) {
        vnode.state.isLoading = true;
        vnode.state.item.supplierKey = supplierKey;
        vnode.state.item.products = [];
        try {
            if (supplierKey) {
                vnode.state.products = await PurchaseOrderFormController.loadProductOptions(supplierKey);
                PurchaseOrderFormController.filterProductsBySupplier(vnode);
            }
        } catch (error) {
            Logger.error("[Audit][PurchaseOrderFormController] Error loading products:", error);
        } finally {
            vnode.state.isLoading = false;
            vnode.state.isModified = true;
            vnode.state.searchText = "";
            m.redraw();
        }
    },

    handleProductSubmit(vnode, productId) {
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

    handleProductRemove(vnode, productId) {
        vnode.state.item.products = vnode.state.item.products.filter(p => p.productKey !== productId);
        vnode.state.isModified = true;
        m.redraw();
    },

    handleProductSearch(vnode) {
        const searchText = vnode.state.searchText.toLowerCase();
        const supplierKey = vnode.state.item.supplierKey;

        vnode.state.filteredProducts = vnode.state.products.filter(product =>
            product.preferredSupplierKey === supplierKey && 
            product.display.toLowerCase().includes(searchText)
        );
        m.redraw();
    },

    calculateTotalOrderAmount(vnode) {
        return vnode.state.item.products.reduce((total, product) => {
            const productInfo = vnode.state.products.find(p => p.id === product.productKey);
            return total + (productInfo && productInfo.unitPrice ? productInfo.unitPrice * product.quantity : 0);
        }, 0).toFixed(2);
    },

    getOrderButtonText(vnode) {
        const productCount = vnode.state.item.products.length;
        const modifiedIndicator = vnode.state.isModified ? "*" : "";
        return `${modifiedIndicator}(${productCount}) Guardar`;
    },

    async handleOrderSubmit(e, vnode) {
        e.preventDefault();
        const totalAmount = parseFloat(PurchaseOrderFormController.calculateTotalOrderAmount(vnode));
        vnode.state.item.totalAmount = isNaN(totalAmount) ? 0 : totalAmount;

        const errors = PurchaseOrderModel.validateForm(vnode.state.item);
        vnode.state.errors = errors || {};

        if (!errors) {
            try {
                vnode.state.isLoading = true;
                await PurchaseOrderModel.save(vnode.state.id, vnode.state.item);
                vnode.state.isModified = false;
                m.route.set('/purchase-orders');
            } catch (error) {
                vnode.state.errors.save = error.message;
            } finally {
                vnode.state.isLoading = false;
                m.redraw();
            }
        } else {
            m.redraw();
        }
    }
};

export default PurchaseOrderFormController;
