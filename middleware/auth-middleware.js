import { isAuthenticatedFirebase, isUserAuthorized } from '../services/auth-service.js';

export function requireAuth() {
    if (!isAuthenticatedFirebase()) {
        window.location.href = './login.html';
    }
}

export function requireRole(requiredRole) {
    if (!isUserAuthorized(requiredRole)) {
        window.location.href = './access-denied.html';
    }
}