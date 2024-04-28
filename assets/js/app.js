import Router from './router.js';
import HomeController from './controllers/home-controller.js';
import LoginController from './controllers/login-controller.js';

const controllers = {
    home: new HomeController(),
    login: new LoginController()
};

const router = new Router(controllers, '');

window.addEventListener('load', () => {
    router.loadRoute();
});

window.addEventListener('hashchange', () => {
    router.loadRoute();
});