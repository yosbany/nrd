import ProveedoresArticuloView from '../views/ProveedoresArticuloView.js';

const ArticuloController = {
    proveedoresArticulo: {
        view: () => m(ProveedoresArticuloView, {articuloId: vnode.attrs.id})
    }
};

export default ArticuloController;