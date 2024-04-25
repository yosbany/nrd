import { loginFirebase } from '../../../services/auth-service.js';
document.addEventListener('DOMContentLoaded', async function () {
    console.log('Login page loaded.');
    document.getElementById('loginBtn').addEventListener('click', async function(event) {
        event.preventDefault();
        const username = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;
        try {
            await loginFirebase(username, password);
            window.location.href = 'index.html#home';
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
        }
    });
    
});
