// app.js

import m from 'https://cdn.jsdelivr.net/npm/mithril/mithril.mjs';
import UserController from './src/controllers/UserController.js';
import ProviderController from './src/controllers/ProviderController.js';
import OrderController from './src/controllers/OrderController.js';
import ClientController from './src/controllers/ClientController.js';
import ArticleController from './src/controllers/ArticleController.js';
import PayrollController from './src/controllers/PayrollController.js';
import MovementController from './src/controllers/MovementController.js';
import RecipeController from './src/controllers/RecipeController.js';
import TaskController from './src/controllers/TaskController.js';
import EmployeeController from './src/controllers/EmployeeController.js';

m.route.prefix = "nrd/#!";
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
