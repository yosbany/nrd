import ProveedoresArticuloView from '../views/ProveedoresArticuloView.js';

const ArticuloController = {
    proveedoresArticulo: {
        view: () => m(ProveedoresArticuloView)
    }
};

export default ArticuloController;