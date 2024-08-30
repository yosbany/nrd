import PurchasePriceModel from '../models/PurchasePricesModel.js';
import ProductModel from '../models/ProductsModel.js';
import SupplierModel from '../models/SuppliersModel.js';
import { decodeId } from '../utils/Helpers.js';
import Logger from '../utils/Logger.js';
import ProductsModel from '../models/ProductsModel.js';
import SuppliersModel from '../models/SuppliersModel.js';

const PurchasePriceFormController = {
    async oninit(vnode) {
        vnode.state.item = {};
        vnode.state.errors = {};
        vnode.state.id = decodeId(vnode.attrs.id);
        vnode.state.conversionLabel = "Conversión de Empaque";

        if (vnode.state.id) {
            vnode.state.item = await PurchasePriceModel.findById(vnode.state.id);
            Logger.warn("[Audit][PurchasePriceFormController] Loading data findById:", vnode.state.item);
            m.redraw();
        }
        else{
            vnode.state.item = await PurchasePriceModel.createDefaultInstance();
            Logger.warn("[Audit][PurchasePriceFormController] Loading data createDefaultInstance:", vnode.state.item);
        }
    },

    async getProductsOptions() {
        return await ProductsModel.getOptionsKeyValue();
    },

    async getSupplierOptions() {
        return await SuppliersModel.getOptionsKeyValue();
    },

    async handleSubmit(e, vnode) {
        e.preventDefault();
    
        const errors = PurchasePriceModel.validateForm(vnode.state.item);
        vnode.state.errors = errors || {};
    
        if (!errors) {
            try {
                const purchasePriceId = await PurchasePriceModel.save(vnode.state.id, vnode.state.item);
                await ProductModel.updatePurchasePriceHistory(vnode.state.item.productKey, {
                    purchasePriceId: purchasePriceId, 
                    unitPrice: vnode.state.item.unitPrice,
                    date: vnode.state.item.date,
                    supplierKey: vnode.state.item.supplierKey,
                    supplierProductName: vnode.state.item.supplierProductName,
                    purchasePackaging: vnode.state.item.purchasePackaging,
                    supplierProductCode: vnode.state.item.supplierProductCode,
                    packagingConversion: vnode.state.item.packagingConversion
                });
    
                m.route.set('/purchase-prices');
            } catch (error) {
                vnode.state.errors = { save: error.message };
                m.redraw();
            }
        } else {
            m.redraw();
        }
    },
    
    async loadProductOptions() {
        const products = await ProductModel.findAll();
        return products.map(product => ({ id: product.id, display: product.name }));
    },

    async loadSupplierOptions() {
        const suppliers = await SupplierModel.findAll();
        return suppliers.map(supplier => ({ id: supplier.id, display: supplier.tradeName }));
    },

    async loadLastPurchasePrice(vnode) {
        const { productKey, supplierKey } = vnode.state.item;
        if (productKey && supplierKey) {
            try {
                const purchasePrices = await PurchasePriceModel.findAll();
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

                m.redraw();
            } catch (error) {
                Logger.error("[Audit][PurchasePriceFormController] Error loading last purchase price:", error);
            }
        }
    },

    async updateConversionLabel(vnode) {
        const productId = vnode.state.item.productKey;
        if (productId) {
            try {
                const product = await ProductModel.findById(productId);
                if (product && product.salesPackaging) {
                    vnode.state.conversionLabel = `Conversión de Empaque a ${product.salesPackaging}`;
                } else {
                    vnode.state.conversionLabel = "Conversión de Empaque";
                }
                m.redraw();
            } catch (error) {
                Logger.error("[Audit][PurchasePriceFormController] Error fetching sales packaging:", error);
            }
        }
    }
};

export default PurchasePriceFormController;
