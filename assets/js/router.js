import HomeController from './controllers/home-controller.js';
import LoginController from './controllers/login-controller.js';

// Define los controladores para cada ruta
const routes = {
    '/': new HomeController(),
    '/index.html': new HomeController(),
    '#home': new HomeController(),
    '/login.html': new LoginController()
};


const BASE_PATH = '/nrd/';

// Función para cargar la ruta actual
export default function router() {
    const hash = window.location.hash;
    const path = window.location.pathname;
    
    if (path && path.startsWith(BASE_PATH)) {
        path = path.slice(BASE_PATH.length);
    }

    let key = hash ? hash : path;

    // Verifica si la ruta actual existe en el objeto routes
    if (routes.hasOwnProperty(key)) {
        const instanceController = routes[key];
        if (hash) {
            // Ejecuta la función correspondiente del controlador si hay un hash en la URL
            const handlerFunction = instanceController[hash];
            if (handlerFunction && typeof handlerFunction === 'function') {
                handlerFunction();
            }
        } else {
            // Ejecuta el método init del controlador si no hay hash en la URL
            if (typeof instanceController.init === 'function') {
                instanceController.init();
            }
        }
    } else {
        console.error('Route not found:', key);
    }
}
