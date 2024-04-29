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

class FirebaseService {
    constructor() {
        // Inicializa Firebase
        const app = initializeApp(firebaseConfig);
        getAnalytics(app);
        this.auth = getAuth(app);
    }

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw new Error('Error al iniciar sesión: ' + error.message);
        }
    }

    async updateProfile(newDisplayName, newPhotoURL, newPhoneNumber) {
        try {
            const user = this.auth.currentUser;
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

    async logout() {
        try {
            await signOut(this.auth);
        } catch (error) {
            throw new Error('Error al cerrar sesión: ' + error.message);
        }
    }

    async isAuthenticated() {
        try {
            const user = await new Promise((resolve) => {
                onAuthStateChanged(this.auth, (user) => {
                    resolve(user);
                });
            });
            return user !== null;
        } catch (error) {
            throw new Error('Error al verificar la autenticación: ' + error.message);
        }
    }

    async getCurrentUser() {
        try {
            const user = await new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                    unsubscribe(); // Detener la escucha después de obtener el usuario
                    resolve(user);
                }, (error) => {
                    unsubscribe(); // Detener la escucha en caso de error
                    reject(error);
                });
            });
            return user;
        } catch (error) {
            throw new Error('Error al verificar la autenticación: ' + error.message);
        }
    }

    isUserAuthorized(requiredRole) {
        const user = this.getCurrentUser();
        return user && user.photoURL === requiredRole;
    }
}

export default new FirebaseService();
