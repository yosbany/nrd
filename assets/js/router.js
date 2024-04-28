const routes = {
    '': 'home',
    'home': 'home',
    'login': 'login'
};

const defaultRoute = '';

export default class Router {
    constructor(controllers, defaultRoute) {
        this.controllers = controllers;
        this.defaultRoute = defaultRoute;
    }

    loadRoute() {
        const hash = window.location.hash.slice(1) || this.defaultRoute;
        const routeName = routes[hash];
        const controller = this.controllers[routeName];
        if (controller) {
            controller.init();
        } else {
            console.error('Route not found');
        }
    }
}