import { showLoaderPage, showLoaderApp, hideLoaderPage, hideLoaderApp, redirectTo } from './util.js';
import HomeController from './controllers/home-controller.js';
import LoginController from './controllers/login-controller.js';

const BASE_PATH = '/nrd/';

const routes = {
    '': new HomeController(),
    'index.html': new HomeController(),
    'home': new HomeController(),
    'login.html': new LoginController(),
    'exit': new HomeController()
};

function getKeyFromHashAndPath() {
    const hash = window.location.hash.slice(1);
    const path = window.location.pathname.slice(BASE_PATH.length);
    return hash || path || '';
}

function executeControllerMethod(controller, methodName) {
    const method = controller[methodName];
    if (method && typeof method === 'function') {
        method.call(controller);
    }
}

function routeNotFound(key) {
    hideLoaderPage();
    hideLoaderApp();
    redirectTo("not-found.html");
}

export default function router() {
    showLoaderPage();
    showLoaderApp();

    const key = getKeyFromHashAndPath();
    console.log("key: ", key);

    if (routes.hasOwnProperty(key)) {
        const controller = routes[key];
        if (!window.location.hash) {
            executeControllerMethod(controller, 'init');
        } else {
            const hashFunction = window.location.hash.slice(1);
            executeControllerMethod(controller, hashFunction);
        }
    } else {
        routeNotFound(key);
    }
}
