import HomeView from './src/views/HomeView.js';
import GenericListView from './src/views/GenericListView.js';
import GenericFormView from './src/views/GenericFormView.js';
import { usuarioRenderItem, usuarioRenderForm } from './src/config/UsusarioConfig.js';
import { proveedorRenderItem, proveedorRenderForm } from './src/config/ProveedorConfig.js';
import { articuloRenderItem, articuloRenderForm } from './src/config/ArticuloConfig.js';
import { ordenRenderItem, ordenRenderForm } from './src/config/OrdenConfig.js';
import ProveedoresArticuloView from './src/views/ProveedoresArticuloView.js';
import ExampleView from './src/views/ExampleView.js';

m.route.prefix = "/nrd/#!";

const ENTITIES = {
    USUARIOS: 'usuarios',
    PROVEEDORES: 'proveedores',
    ORDENES: 'ordenes',
    CLIENTES: 'clientes',
    ARTICULOS: 'articulos',
    NOMINAS: 'nominas',
    MOVIMIENTOS: 'movimientos',
    RECETAS: 'recetas',
    TAREAS: 'tareas',
    EMPLEADOS: 'empleados'
};

m.route(document.getElementById('app'), '/home', {
    '/home': HomeView,
    '/usuarios': {
        render: () => m(GenericListView, { entity: ENTITIES.USUARIOS, renderItem: usuarioRenderItem })
    },
    '/usuarios/nuevo': {
        render: () => m(GenericFormView, { entity: ENTITIES.USUARIOS, renderForm: usuarioRenderForm })
    },
    '/usuarios/editar/:id': {
        render: (vnode) => m(GenericFormView, { entity: ENTITIES.USUARIOS, renderForm: usuarioRenderForm, id: vnode.attrs.id })
    },
    '/proveedores': {
        render: () => m(GenericListView, { entity: ENTITIES.PROVEEDORES, renderItem: proveedorRenderItem })
    },
    '/proveedores/nuevo': {
        render: () => m(GenericFormView, { entity: ENTITIES.PROVEEDORES, renderForm: proveedorRenderForm })
    },
    '/proveedores/editar/:id': {
        render: (vnode) => m(GenericFormView, { entity: ENTITIES.PROVEEDORES, renderForm: proveedorRenderForm, id: vnode.attrs.id })
    },
    '/articulos': {
        render: () => m(GenericListView, { entity: ENTITIES.ARTICULOS, renderItem: articuloRenderItem })
    },
    '/articulos/nuevo': {
        render: () => m(GenericFormView, { entity: ENTITIES.ARTICULOS, renderForm: articuloRenderForm })
    },
    '/articulos/editar/:id': {
        render: (vnode) => m(GenericFormView, { entity: ENTITIES.ARTICULOS, renderForm: articuloRenderForm, id: vnode.attrs.id })
    },
    '/proveedores-articulo/:id': {
        render: (vnode) => m(ProveedoresArticuloView, { articuloId: vnode.attrs.id })
    },
    '/ordenes': {
        render: () => m(GenericListView, { entity: ENTITIES.ORDENES, renderItem: ordenRenderItem })
    },
    '/ordenes/nuevo': {
        render: () => m(GenericFormView, { entity: ENTITIES.ORDENES, renderForm: ordenRenderForm })
    },
    '/ordenes/editar/:id': {
        render: (vnode) => m(GenericFormView, { entity: ENTITIES.ORDENES, renderForm: ordenRenderForm, id: vnode.attrs.id })
    },
    '/example': {
        render: (vnode) => m(ExampleView)
    }
});
