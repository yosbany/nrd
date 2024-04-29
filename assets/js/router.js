const routes = {
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
        console.log(hash);
        const routeName = routes[hash];
        console.log(routeName);
        const controller = this.controllers[routeName];
        console.log(controller);
        if (controller) {
            controller.init();
        } 
    }
}