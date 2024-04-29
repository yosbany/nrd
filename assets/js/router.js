import HomeController from './controllers/home-controller.js';
import LoginController from './controllers/login-controller.js';

const routes = {
    '/': {
        'contoller': new HomeController()
    },
    '/index.html': {
        'contoller': new HomeController()
    },
    '#home': {
        'contoller': new HomeController()
    },
    '/login.html': {
        'contoller': new LoginController()
    }
};

export default loadRoute() {
    const hash = window.location.hash;
    const path = window.location.pathname;
    let key = hash ? hash : path;
    const instanceController = routes[key].contoller;
    if (hash) {
        const handlerFunction = instanceController[hash];
        if (handlerFunction && typeof handlerFunction === 'function') {
            handlerFunction();
        }
    }
    else{
        if (typeof instanceController.init === 'function') {
            instanceController.init();
        }
    }
}