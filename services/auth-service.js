import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js';
import { getAuth, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyB5R_TG0Vq4LtbkXovYp8wDzhIfyYKwfgE",
    authDomain: "nrd-auth-e8f32.firebaseapp.com",
    projectId: "nrd-auth-e8f32",
    storageBucket: "nrd-auth-e8f32.appspot.com",
    messagingSenderId: "902534242085",
    appId: "1:902534242085:web:2c96750cb061396a0a44cc",
    measurementId: "G-BJ6P6LPR52"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);

export async function loginFirebase(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error('Error al iniciar sesión: ' + error.message);
    }
}


export async function updateProfileFirebase(newDisplayName, newPhotoURL, newPhoneNumber) {
    try {
        const user = auth.currentUser;
        if (user) {
            await updateProfile(user, {
                displayName: newDisplayName,
                photoURL: newPhotoURL,
                phoneNumber: newPhoneNumber
            });
        } else {
            throw new Error('No hay usuario autenticado');
        }
    } catch (error) {
        throw new Error('Error al actualizar el perfil: ' + error.message);
    }
}

// Función para cerrar sesión
export async function logoutFirebase() {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error('Error al cerrar sesión: ' + error.message);
    }
}

export async function isAuthenticatedFirebase() {
    try {
        const user = await new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                resolve(user);
            });
        });
        return user !== null;
    } catch (error) {
        throw new Error('Error al verificar la autenticación: ' + error.message);
    }
}

export async function getCurrentUserFirebase() {
    try {
        const user = await new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                resolve(user);
            });
        });
        return user;
    } catch (error) {
        throw new Error('Error al verificar la autenticación: ' + error.message);
    }
}

export function isUserAuthorized(requiredRole) {
    const user = getCurrentUserFirebase();
    return user && user.photoURL === requiredRole;
}