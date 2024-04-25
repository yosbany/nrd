import { getCurrentUserFirebase, isUserAuthorized } from '../services/auth-service.js';

export function requireAuth() {
    const currentUser = getCurrentUserFirebase();
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

export function requireRole(requiredRole) {
    if (!isUserAuthorized(requiredRole)) {
        window.location.href = 'access-denied.html';
    }
}