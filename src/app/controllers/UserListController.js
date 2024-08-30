import UsersModel from '../models/UsersModel.js';
import Logger from '../utils/Logger.js';

const UserListController = {
    async oninit(vnode) {
        vnode.state.searchText = '';
        vnode.state.users = [];
        vnode.state.loading = true;

        await this.loadUsers(vnode);
    },

    async loadUsers(vnode) {
        try {
            const users = await UsersModel.findAll();
            vnode.state.users = users;
            vnode.state.loading = false;
            Logger.info("[Audit][UserListController] Users loaded successfully");
            m.redraw();
        } catch (error) {
            Logger.error("[Audit][UserListController] Error loading users:", error);
            vnode.state.loading = false;
            m.redraw();
        }
    },

    filterItems(vnode) {
        if (!vnode.state.searchText) return vnode.state.users;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.users.filter(user =>
            Object.values(user).some(value =>
                value && value.toString().toLowerCase().includes(searchText)
            )
        );
    },

    async onDelete(vnode, id) {
        try {
            await UsersModel.delete(id);
            Logger.info("[Audit][UserListController] User deleted successfully with ID:", id);
            await this.loadUsers(vnode);
        } catch (error) {
            Logger.error("[Audit][UserListController] Error deleting user:", error);
        }
    }
};

export default UserListController;
