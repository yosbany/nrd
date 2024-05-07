import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { getDatabase, ref, set, get, push } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCOKQBJthEjqji2GxPsjcEZtUu965wtc1c",
    authDomain: "nrd-firebase.firebaseapp.com",
    databaseURL: "https://nrd-firebase-default-rtdb.firebaseio.com",
    projectId: "nrd-firebase",
    storageBucket: "nrd-firebase.appspot.com",
    messagingSenderId: "840023356475",
    appId: "1:840023356475:web:a7411b9b5808ac51d8581e"
};

class FirebaseService {
    constructor() {
        // Inicializa Firebase
        const app = initializeApp(firebaseConfig);
        this.auth = getAuth(app);
        this.db = getDatabase(app);
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

    async writeData(path, data) {
        try {
            await set(ref(this.db, path), data);
        } catch (error) {
            throw new Error('Error al escribir en la base de datos: ' + error.message);
        }
    }

    async readData(path) {
        try {
            const snapshot = await get(ref(this.db, path));
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                throw new Error('No se encontraron datos en la ruta especificada');
            }
        } catch (error) {
            throw new Error('Error al leer de la base de datos: ' + error.message);
        }
    }

    async pushData(path, data) {
        try {
            const newDataRef = push(ref(this.db, path));
            await set(newDataRef, data);
            return newDataRef.key;
        } catch (error) {
            throw new Error('Error al escribir en la base de datos: ' + error.message);
        }
    }
}

export default new FirebaseService();
