// app.js

import m from 'https://cdn.jsdelivr.net/npm/mithril/mithril.js';
import UserController from './src/controllers/UserController';
import ProviderController from './src/controllers/ProviderController';
import OrderController from './src/controllers/OrderController';
import ClientController from './src/controllers/ClientController';
import ArticleController from './src/controllers/ArticleController';
import PayrollController from './src/controllers/PayrollController';
import MovementController from './src/controllers/MovementController';
import RecipeController from './src/controllers/RecipeController';
import TaskController from './src/controllers/TaskController';
import EmployeeController from './src/controllers/EmployeeController';

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
