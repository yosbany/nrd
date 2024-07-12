import GenericController from './src/controllers/GenericController.js';
import { userRenderItem, userRenderForm } from './src/config/UserConfig.js';
import HomeController from './src/controllers/HomeController.js';

m.route.prefix = "/nrd/#!";

m.route(document.getElementById('app'), '/home', {
    '/home': HomeController.home(),
    '/usuarios': GenericController.list('usuarios', userRenderItem),
    '/usuarios/nuevo': GenericController.form('usuarios', userRenderForm),
    '/usuarios/editar/:id': GenericController.form('usuarios', userRenderForm),
    '/usuarios/eliminar/:id': GenericController.delete('usuarios'),
});
