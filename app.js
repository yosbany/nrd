// app.js

import m from 'mithril';
import UserController from './controllers/UserController';
import ProviderController from './controllers/ProviderController';
import OrderController from './controllers/OrderController';
import ClientController from './controllers/ClientController';
import ArticleController from './controllers/ArticleController';
import PayrollController from './controllers/PayrollController';
import MovementController from './controllers/MovementController';
import RecipeController from './controllers/RecipeController';
import TaskController from './controllers/TaskController';
import EmployeeController from './controllers/EmployeeController';

// Rutas de la aplicación
m.route(document.getElementById('app'), '/', {
    '/': UserController.UserList,
    '/nuevo-usuario': UserController.NuevoUsuarioForm,
    '/proveedores': ProviderController.ProviderList,
    '/nuevo-proveedor': ProviderController.NuevoProveedorForm,
    '/ordenes': OrderController.OrderList,
    '/nueva-orden': OrderController.NuevoOrdenForm,
    '/clientes': ClientController.ClientList,
    '/nuevo-cliente': ClientController.NuevoClienteForm,
    '/articulos': ArticleController.ArticleList,
    '/nuevo-articulo': ArticleController.NuevoArticuloForm,
    '/nominas': PayrollController.PayrollList,
    '/nueva-nomina': PayrollController.NuevaNominaForm,
    '/movimientos': MovementController.MovementList,
    '/nuevo-movimiento': MovementController.NuevoMovimientoForm,
    '/recetas': RecipeController.RecipeList,
    '/nueva-receta': RecipeController.NuevaRecetaForm,
    '/tareas': TaskController.TaskList,
    '/nueva-tarea': TaskController.NuevaTareaForm,
    '/empleados': EmployeeController.EmployeeList,
    '/nuevo-empleado': EmployeeController.NuevoEmpleadoForm
});
