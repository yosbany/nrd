import BaseController from './base-controller.js';
import HomeView from '../views/home-view.js';

export default class HomeController extends BaseController{
    
    constructor() {
        super();
        this.view = new HomeView();
    }

    async init() {
        this.view.render();
    }
}