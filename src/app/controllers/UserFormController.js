import Logger from '../utils/Logger.js';
import { decodeId } from '../utils/Helpers.js';
import UsersModel from '../models/UsersModel.js';

const UserFormController = {
    async oninit(vnode) {
        vnode.state.item = {};
        vnode.state.errors = {};
        vnode.state.id = decodeId(vnode.attrs.id);

        if (vnode.state.id) {
            await this.loadUserData(vnode);
        }
    },

    async loadUserData(vnode) {
        try {
            const data = await UsersModel.findById(vnode.state.id);
            vnode.state.item = { ...data };
            Logger.info(`[Audit][UserFormController] User data loaded for ID: ${vnode.state.id}`);
        } catch (error) {
            Logger.error("[Audit][UserFormController] Error loading user data:", error);
        } finally {
            m.redraw();
        }
    },


    async handleSubmit(e, vnode) {
        e.preventDefault();

        const errors = UsersModel.validateForm(vnode.state.item);
        vnode.state.errors = errors || {};
        
        if (!errors) {
            try {
                await UsersModel.save(vnode.state.id, vnode.state.item);
                Logger.info(`[Audit][UserFormController] User saved successfully with ID: ${vnode.state.id}`);
                m.route.set('/users');
            } catch (error) {
                vnode.state.errors = { save: error.message };
                Logger.error("[Audit][UserFormController] Error saving user:", error);
                m.redraw();
            }
        } else {
            m.redraw();
        }
    }
};

export default UserFormController;
