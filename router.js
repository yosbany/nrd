import App from './src/components/App.js';
import HomeView from './src/views/HomeView.js';
import UsuarioListView from './src/views/UsuarioListView.js';
import UsuarioFormView from './src/views/UsuarioFormView.js';
import ProveedorListView from './src/views/ProveedorListView.js';
import ProveedorFormView from './src/views/ProveedorFormView.js';

m.route.prefix = "/nrd/#!";

m.route(document.getElementById('app'), '/home', {
    '/home': {
        render: () => m(App, m(HomeView))
    },
    '/usuarios': {
        render: () => m(App, m(UsuarioListView))
    },
    '/usuarios/nuevo': {
        render: () => m(App, m(UsuarioFormView))
    },
    '/usuarios/editar/:id': {
        render: (vnode) => m(App, m(UsuarioFormView, { id: vnode.attrs.id }))
    },
    '/proveedores': {
        render: () => m(App, m(ProveedorListView))
    },
    '/proveedores/nuevo': {
        render: () => m(App, m(ProveedorFormView))
    },
    '/proveedores/editar/:id': {
        render: (vnode) => m(App, m(ProveedorFormView, { id: vnode.attrs.id }))
    }
});
