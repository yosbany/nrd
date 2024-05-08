import BaseController from './base-controller.js';
import LoginView from '../views/login-view.js';
import FirebaseServiceInstance from '../../../services/firebase-service.js';

export default class LoginController extends BaseController {

    constructor() {
        super();
        this.view = new LoginView();
        this.initEventsController();
    }

    initEventsController(){
        this.subscribeEvent('EVLogin', (event) => {
            const email = event.email;
            const password = event.password;
            FirebaseServiceInstance.login(email, password);
            this.redirectToPage("index.html");
        });
    }

    async init() {
        console.log("LoginController init");
        this.view.renderView();
    }
}
