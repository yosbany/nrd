import { login } from '../../../services/auth-service.js';

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        await login(username, password);
        window.location.href = 'home.html';
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
    }
});