import App from './src/components/App.js';
import HomeView from './src/views/HomeView.js';
import GenericListView from './src/views/GenericListView.js';
import GenericFormView from './src/views/GenericFormView.js';
import { usuarioRenderItem, usuarioRenderForm } from './src/config/UsusarioConfig.js';
import { proveedorRenderItem, proveedorRenderForm } from './src/config/ProveedorConfig.js';
import { articuloRenderItem, articuloRenderForm } from './src/config/ArticuloConfig.js';
import { ordenRenderItem, ordenRenderForm } from './src/config/OrdenConfig.js';
import ProveedoresArticuloView from './src/views/ProveedoresArticuloView.js';
import { ENTITIES } from './constants.js';

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
        render: () => m(App, m(GenericListView, { entity: ENTITIES.PROVEEDORES, renderItem: proveedorRenderItem }))
    },
    '/proveedores/nuevo': {
        render: () => m(App, m(GenericFormView, { entity: ENTITIES.PROVEEDORES, renderForm: proveedorRenderForm }))
    },
    '/proveedores/editar/:id': {
        render: (vnode) => m(App, m(GenericFormView, { entity: ENTITIES.PROVEEDORES, renderForm: proveedorRenderForm, id: vnode.attrs.id }))
    },
    '/articulos': {
        render: () => m(App, m(GenericListView, { entity: ENTITIES.ARTICULOS, renderItem: articuloRenderItem }))
    },
    '/articulos/nuevo': {
        render: () => m(App, m(GenericFormView, { entity: ENTITIES.ARTICULOS, renderForm: articuloRenderForm }))
    },
    '/articulos/editar/:id': {
        render: (vnode) => m(App, m(GenericFormView, { entity: ENTITIES.ARTICULOS, renderForm: articuloRenderForm, id: vnode.attrs.id }))
    },
    '/proveedores-articulo/:id': {
        render: (vnode) => m(App, m(ProveedoresArticuloView, { articuloId: vnode.attrs.id }))
    },
    '/ordenes': {
        render: () => m(App, m(GenericListView, { entity: ENTITIES.ORDENES, renderItem: ordenRenderItem }))
    },
    '/ordenes/nuevo': {
        render: () => m(App, m(GenericFormView, { entity: ENTITIES.ORDENES, renderForm: ordenRenderForm }))
    },
    '/ordenes/editar/:id': {
        render: (vnode) => m(App, m(GenericFormView, { entity: ENTITIES.ORDENES, renderForm: ordenRenderForm, id: vnode.attrs.id }))
    }
});
