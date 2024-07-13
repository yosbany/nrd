import GenericController from './src/controllers/GenericController.js';
import { usuarioRenderItem, usuarioRenderForm } from './src/config/UsusarioConfig.js';
import { proveedorRenderItem, proveedorRenderForm } from './src/config/ProveedorConfig.js';
import { articuloRenderItem, articuloRenderForm } from './src/config/ArticuloConfig.js';
import HomeController from './src/controllers/HomeController.js';
import ArticuloController from './src/controllers/ArticuloController.js';

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
    '/home': HomeController.home,
    '/usuarios': GenericController.list(ENTITIES.USUARIOS, usuarioRenderItem),
    '/usuarios/nuevo': GenericController.form(ENTITIES.USUARIOS, usuarioRenderForm),
    '/usuarios/editar/:id': GenericController.form(ENTITIES.USUARIOS, usuarioRenderForm),
    '/usuarios/eliminar/:id': GenericController.delete(ENTITIES.USUARIOS),
    
    '/proveedores': GenericController.list(ENTITIES.PROVEEDORES, proveedorRenderItem),
    '/proveedores/nuevo': GenericController.form(ENTITIES.PROVEEDORES, proveedorRenderForm),
    '/proveedores/editar/:id': GenericController.form(ENTITIES.PROVEEDORES, proveedorRenderForm),
    '/proveedores/eliminar/:id': GenericController.delete(ENTITIES.PROVEEDORES),

    '/articulos': GenericController.list(ENTITIES.ARTICULOS, articuloRenderItem),
    '/articulos/nuevo': GenericController.form(ENTITIES.ARTICULOS, articuloRenderForm),
    '/articulos/editar/:id': GenericController.form(ENTITIES.ARTICULOS, articuloRenderForm),
    '/articulos/eliminar/:id': GenericController.delete(ENTITIES.ARTICULOS),
    '/proveedores-articulo/:id': ArticuloController.proveedoresArticulo(),
});
