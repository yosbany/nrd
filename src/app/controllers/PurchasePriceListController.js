import PurchasePriceModel from '../models/PurchasePricesModel.js';
import Logger from '../utils/Logger.js';
import { encodeId } from '../utils/Helpers.js';

const PurchasePriceListController = {
    async initialize(vnode) {
        vnode.state.searchText = '';
        vnode.state.purchasePrices = [];
        vnode.state.loading = true;

        try {
            const data = await PurchasePriceModel.findAll();
            vnode.state.purchasePrices = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            vnode.state.loading = false;
            Logger.info("[Audit][PurchasePriceListController] Purchase prices loaded successfully.");
        } catch (error) {
            Logger.error("[Audit][PurchasePriceListController] Error loading purchase prices:", error);
            vnode.state.loading = false;
        }
        m.redraw();
    },

    deepSearch(obj, searchText) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'string' || typeof value === 'number') {
                    if (value.toString().toLowerCase().includes(searchText)) {
                        return true;
                    }
                } else if (typeof value === 'object' && value !== null) {
                    if (this.deepSearch(value, searchText)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    filterItems(vnode) {
        if (!vnode.state.searchText) return vnode.state.purchasePrices;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.purchasePrices.filter(purchasePrice =>
            this.deepSearch(purchasePrice, searchText)
        );
    },

    onEdit(id) {
        m.route.set(`/purchase-prices/${encodeId(id)}`);
    },

    async onDelete(vnode, id) {
        try {
            await PurchasePriceModel.delete(id);
            this.initialize(vnode);  // Recargar la lista después de eliminar
            Logger.info(`[Audit][PurchasePriceListController] Purchase price with ID ${id} deleted successfully.`);
        } catch (error) {
            Logger.error("[Audit][PurchasePriceListController] Error deleting purchase price:", error);
        }
    }
};

export default PurchasePriceListController;
