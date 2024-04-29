import BaseController from './base-controller.js';
import HomeView from '../views/home-view.js';
import FirebaseServiceInstance from '../../../services/firebase-service.js';

export default class HomeController extends BaseController{
    
    constructor() {
        super();
        this.view = new HomeView();
    }

    async init() {
        console.log("HomeController init");
        this.view.home();
    }

    async home() {
        console.log("HomeController home");
        this.view.home();
    }

    exit(){
        console.log("HomeController exit");
        FirebaseServiceInstance.logout();
        this.redirectToPage("login.html");
    }
}