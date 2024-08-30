import SupplierModel from '../models/SuppliersModel.js';
import { encodeId } from '../utils/Helpers.js';
import Logger from '../utils/Logger.js';

const SupplierListController = {
    async oninit(vnode) {
        vnode.state.searchText = '';
        vnode.state.suppliers = [];
        vnode.state.loading = true;

        await SupplierListController.loadSuppliers(vnode);
    },

    async loadSuppliers(vnode) {
        try {
            const suppliers = await SupplierModel.findAll();
            vnode.state.suppliers = suppliers.map(supplier => ({
                ...supplier,
                formatPhoneNumber: SupplierListController.formatPhoneNumber(supplier.phone)
            }));
            vnode.state.loading = false;
            Logger.info("[Audit][SupplierListController] Suppliers loaded successfully");
            m.redraw();
        } catch (error) {
            Logger.error("[Audit][SupplierListController] Error loading suppliers:", error);
            vnode.state.loading = false;
            m.redraw();
        }
    },

    filterItems(vnode) {
        if (!vnode.state.searchText) return vnode.state.suppliers;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.suppliers.filter(supplier =>
            Object.values(supplier).some(value =>
                value && value.toString().toLowerCase().includes(searchText)
            )
        );
    },

    onEdit(id) {
        Logger.info("[Audit][SupplierListController] Editing supplier with ID:", id);
        m.route.set(`/suppliers/${encodeId(id)}`);
    },

    async onDelete(vnode, id) {
        try {
            await SupplierModel.delete(id);
            Logger.info("[Audit][SupplierListController] Supplier deleted successfully with ID:", id);
            await SupplierListController.loadSuppliers(vnode);
        } catch (error) {
            Logger.error("[Audit][SupplierListController] Error deleting supplier:", error);
        }
    },

    formatPhoneNumber(phone) {
        if (!phone) return "";
        const rawPhone = phone.replace(/^\+598/, '');
        return `+598 ${rawPhone.slice(0, 2)} ${rawPhone.slice(2, 5)} ${rawPhone.slice(5)}`;
    }
};

export default SupplierListController;
