import SupplierModel from '../models/SuppliersModel.js';
import Logger from '../utils/Logger.js';
import { decodeId } from '../utils/Helpers.js';

const SupplierFormController = {
    async oninit(vnode) {
        vnode.state.item = {};
        vnode.state.errors = {};
        vnode.state.id = decodeId(vnode.attrs.id);

        if (vnode.attrs.id) {
            vnode.state.item = await SupplierModel.findById(vnode.state.id);
            Logger.warn("[Audit][SupplierFormController] Loading data findById:", vnode.state.item);
            m.redraw();
        }
        else{
            vnode.state.item = await SupplierModel.createDefaultInstance();
            Logger.warn("[Audit][SupplierFormController] Loading data createDefaultInstance:", vnode.state.item);
            m.redraw();
        }
    },

    async handleSubmit(e, vnode) {
        e.preventDefault();
        if (vnode.state.item.phone) {
            vnode.state.item.phone = `+598${vnode.state.item.phone}`;
        }

        const errors = SupplierModel.validateForm(vnode.state.item);
        vnode.state.errors = errors || {};

        if (!errors) {
            try {
                await SupplierModel.save(vnode.state.id, vnode.state.item);
                Logger.info(`[Audit][SupplierFormController] Supplier saved successfully with ID: ${vnode.state.id}`);
                m.route.set('/suppliers');
            } catch (error) {
                vnode.state.errors = { save: error.message };
                Logger.error("[Audit][SupplierFormController] Error saving supplier:", error);
                m.redraw();
            }
        } else {
            m.redraw();
        }
    },

    formatPhoneNumber(phone) {
        const rawPhone = phone.replace(/^\+598/, '');
        return `+598 ${rawPhone.slice(0, 2)} ${rawPhone.slice(2, 5)} ${rawPhone.slice(5)}`;
    }
};

export default SupplierFormController;
