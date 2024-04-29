import BaseView from './base-view.js';

export default class LoginView extends BaseView {
    constructor() {
        super();
    }

    renderView() {
        this.initEventsView();
    }

    initEventsView() {
        document.getElementById('submitBtn').addEventListener('click', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                this.emitEventController("EVLogin", { 'email': email, 'password': password })
            } catch (error) {
                console.error('Error al iniciar sesión:', error.message);
            }
        });
    }
}