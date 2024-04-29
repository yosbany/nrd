import { showLoaderPage, showLoaderApp } from './util.js'
import HomeController from './controllers/home-controller.js';
import LoginController from './controllers/login-controller.js';

const BASE_PATH = '/nrd/';

// Define los controladores para cada ruta
const routes = {
    '': new HomeController(),
    'index.html': new HomeController(),
    'home': new HomeController(),
    'login.html': new LoginController(),
    'exit': new HomeController()
};

// Función para cargar la ruta actual
export default function router() {
    showLoaderPage();
    showLoaderApp();

    const hash = window.location.hash.slice(1);
    const path = window.location.pathname.slice(BASE_PATH.length);

    let key = hash ? hash : path;
    console.log("key: ", key)
    // Verifica si la ruta actual existe en el objeto routes
    if (routes.hasOwnProperty(key)) {
        const instanceController = routes[key];
        if (hash) {
            // Ejecuta la función correspondiente del controlador si hay un hash en la URL
            const hashFunction = hash.slice(1);
            const handlerFunction = instanceController[hashFunction];
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
