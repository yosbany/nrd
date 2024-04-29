import BaseController from './base-controller.js';
import LoginView from '../views/login-view.js';

export default class LoginController extends BaseController{
    
    constructor() {
        super();
        this.view = new LoginView();
    }

    async init() {
        console.log("LoginController init");
        this.view.render();
    }
}