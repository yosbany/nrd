import ProductModel from '../models/ProductsModel.js';
import Logger from '../utils/Logger.js';
import { encodeId } from '../utils/Helpers.js'; 

const ProductListController = {
    async oninit(vnode) {
        vnode.state.searchText = '';
        vnode.state.products = [];
        vnode.state.loading = true;

        await ProductListController.loadProducts(vnode);
    },

    async loadProducts(vnode) {
        try {
            const data = await ProductModel.findAll();
            vnode.state.products = data;
            vnode.state.loading = false;
            m.redraw();
        } catch (error) {
            Logger.error("[Audit][ProductController] Error loading products:", error);
            vnode.state.loading = false;
            m.redraw();
        }
    },

    filterItems(vnode) {
        if (!vnode.state.searchText) return vnode.state.products;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.products.filter(product =>
            Object.values(product).some(value =>
                value && value.toString().toLowerCase().includes(searchText)
            )
        );
    },

    onEdit(id) {
        m.route.set(`/products/${encodeId(id)}`);
    },

    async onDelete(vnode, id) {
        try {
            await ProductModel.delete(id); // Usamos ProductModel para eliminar un producto
            await this.loadProducts(vnode); // Recargar los productos después de eliminar
        } catch (error) {
            Logger.error("[Audit][ProductController] Error deleting product:", error);
        }
    }
};

export default ProductListController;
