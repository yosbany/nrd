let currentUser = null;

const users = [
    { username: 'user1', password: 'password1', role: 'user' },
    { username: 'admin1', password: 'adminpassword1', role: 'admin' }
];

export async function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
    } else {
        throw new Error('Credenciales inválidas');
    }
}

export function logout() {
    // Lógica para cerrar sesión
    currentUser = null;
}

export function getCurrentUser() {
    return currentUser;
}

export function isUserAuthorized(requiredRole) {
    const user = getCurrentUser();
    return user && user.role === requiredRole;
}