import ProductsModel from '../models/ProductsModel.js';
import SuppliersModel from '../models/SuppliersModel.js';
import { decodeId } from '../utils/Helpers.js';
import Logger from '../utils/Logger.js';

const ProductFormController = {
    async oninit(vnode) {
        vnode.state.item = {};
        vnode.state.errors = {};
        vnode.state.id = decodeId(vnode.attrs.id);
        vnode.state.stats = {};

        if (vnode.attrs.id) {
            vnode.state.item = await ProductsModel.findById(vnode.state.id);
            Logger.warn("[Audit][ProductFormController] Loading data findById:", vnode.state.item);
            m.redraw();
        }
        else{
            vnode.state.item = await ProductsModel.createDefaultInstance();
            Logger.warn("[Audit][ProductFormController] Loading data createDefaultInstance:", vnode.state.item);
            m.redraw();
        }

        vnode.state.stats = await ProductFormController.getStatistics(vnode);
        m.redraw();
    },

    async handleSubmit(e, vnode) {
        e.preventDefault();
    
        const errors = ProductsModel.validateForm(vnode.state.item);
        vnode.state.errors = errors || {};
    
        if (!errors) {
            try {
                await ProductsModel.save(vnode.state.id, vnode.state.item);
                m.route.set('/products');
            } catch (error) {
                vnode.state.errors = { save: error.message };
                m.redraw();
            }
        } else {
            m.redraw();
        }
    },

    async getSupplierOptions() {
        return await SuppliersModel.getOptionsKeyValue();
    },

    async getStatistics(vnode) {
        const purchaseHistory = vnode.state.item.purchasePriceHistory || [];
        
        if (purchaseHistory.length === 0) {
            return {
                lastPrice: 0,
                lastSupplier: "",
                minPrice: 0,
                minPriceSupplier: "",
                unitCost: 0,
                salePrice20: 0,
                salePrice25: 0,
                salePrice30: 0
            };
        }
    
        const suppliers = await ProductFormController.getSupplierOptions();
    
        const lastPurchase = purchaseHistory[purchaseHistory.length - 1];
        const unitCost = lastPurchase.unitPrice / lastPurchase.packagingConversion;
    
        const minPricePurchase = purchaseHistory.reduce((min, current) => 
            current.unitPrice < min.unitPrice ? current : min, purchaseHistory[0]
        );
    
        const calculateSalePrice = (cost, margin) => Math.round(cost / (1 - margin));
    
        return {
            lastPrice: lastPurchase.unitPrice,
            lastSupplier: suppliers.find(s => s.id === lastPurchase.supplierKey)?.display || "",
            minPrice: minPricePurchase.unitPrice,
            minPriceSupplier: suppliers.find(s => s.id === minPricePurchase.supplierKey)?.display || "",
            unitCost: unitCost.toFixed(2),
            salePrice20: calculateSalePrice(unitCost, 0.20),
            salePrice25: calculateSalePrice(unitCost, 0.25),
            salePrice30: calculateSalePrice(unitCost, 0.30)
        };
    }
};

export default ProductFormController;
