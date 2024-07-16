import App from './App.js';
import HomeView from './views/HomeView.js';
import GenericListView from './views/GenericListView.js';
import GenericFormView from './views/GenericFormView.js';
import { usuarioRenderItem, usuarioRenderForm } from './config/UsusarioConfig.js';
import { proveedorRenderItem, proveedorRenderForm } from './config/ProveedorConfig.js';
import { articuloRenderItem, articuloRenderForm } from './config/ArticuloConfig.js';
import { ordenRenderItem, ordenRenderForm } from './config/OrdenConfig.js';
import ProveedoresArticuloView from './views/ProveedoresArticuloView.js';
import { ENTITIES } from './constants.js';

m.route.prefix = "/nrd/#!";

m.route(document.getElementById('app'), '/home', {
    '/home': {
        render: () => m(App, m(HomeView))
    },
    '/usuarios': {
        render: () => m(App, m(GenericListView, { entity: ENTITIES.USUARIOS, renderItem: usuarioRenderItem }))
    },
    '/usuarios/nuevo': {
        render: () => m(App, m(GenericFormView, { entity: ENTITIES.USUARIOS, renderForm: usuarioRenderForm }))
    },
    '/usuarios/editar/:id': {
        render: (vnode) => m(App, m(GenericFormView, { entity: ENTITIES.USUARIOS, renderForm: usuarioRenderForm, id: vnode.attrs.id }))
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
