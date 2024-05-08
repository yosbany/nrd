import BaseController from './base-controller.js';
import LoginView from '../views/login-view.js';
import FirebaseServiceInstance from '../../../services/firebase-service.js';

export default class LoginController extends BaseController {

    constructor() {
        super();
        this.view = new LoginView(this);
    }

    async init() {
        console.log("LoginController init");
        this.view.renderView();
    }

    async login(email, password){
        try{
            await FirebaseServiceInstance.login(email, password);
            this.redirectToPage("index.html");
        }
        catch(error){
            console.log("No se pudo autenticar");
        }
        
        
    }
}
