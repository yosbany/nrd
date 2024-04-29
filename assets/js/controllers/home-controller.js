import BaseController from './base-controller.js';
import HomeView from '../views/home-view.js';

export default class HomeController extends BaseController{
    
    constructor() {
        super();
        this.view = new HomeView();
    }

    async init() {
        console.log("HomeController init");
        this.view.render();
    }

    async home() {
        console.log("HomeController home");
        this.view.render();
    }
}