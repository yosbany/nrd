import { getCurrentUser } from '../services/auth-service.js';

export function requireAuth() {
    const currentUser = getCurrentUser();
    console.log("currentUser: ",currentUser);
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

export function requireRole(requiredRole) {
    const user = getCurrentUser();
    if (!user || user.role !== requiredRole) {
        // Si el usuario no tiene el rol adecuado, redirige a una página de acceso denegado
        window.location.href = 'access-denied.html';
    }
}