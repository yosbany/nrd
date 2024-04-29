import BaseController from './base-controller.js';
import LoginView from '../views/login-view.js';
import FirebaseServiceInstance from '../../../services/firebase-service.js';

export default class LoginController extends BaseController {

    constructor() {
        super();
        this.view = new LoginView();
    }

    async init() {
        console.log("LoginController init");
        document.getElementById('submitBtn').addEventListener('click', async function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                await FirebaseServiceInstance.login(email, password);
                window.location.href = '#home';
            } catch (error) {
                console.error('Error al iniciar sesión:', error.message);
            }
        });
    }
}