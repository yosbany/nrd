import BaseController from './base-controller.js';
import HomeView from '../views/home-view.js';
import FirebaseServiceInstance from '../../../services/firebase-service.js';

export default class HomeController extends BaseController {

    constructor() {
        super();
        this.view = new HomeView();
        this.initEventsController();
    }

    initEventsController() {

    }

    async init() {
        console.log("HomeController init");
        this.view.renderView();
    }

    async home() {
        console.log("HomeController home");
        this.view.renderView();
        await FirebaseServiceInstance.login('nriodor@gmail.com', 'NuevaR1oDor..');
        await FirebaseServiceInstance.getData('routes');
    }

    exit() {
        console.log("HomeController exit");
        FirebaseServiceInstance.logout();
        this.redirectToPage("login.html");
    }

}