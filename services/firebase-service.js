import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
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
            this.registerCurrentUserInDatabase();
            return userCredential.user;
        } catch (error) {
            throw new Error('Error al iniciar sesión: ' + error.message);
        }
    }

    async logout() {
        try {
            await signOut(this.auth);
        } catch (error) {
            throw new Error('Error al cerrar sesión: ' + error.message);
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

    async registerCurrentUserInDatabase() {
        try {
            const user = await this.getCurrentUser();
            const defaultRole = "empleado";

            if (!user) {
                throw new Error('No hay usuario autenticado para registrar en la base de datos');
            }

            const userData = await this.getData(`users/${user.uid}`);
            // Verificar si el usuario ya está registrado en la base de datos
            if (!userData) {
                // El usuario no está registrado, proceder con el registro
                const userDataToSave = {
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    role: defaultRole
                };
                await set(ref(this.db, `users/${user.uid}`), userDataToSave);
                console.log('Usuario registrado en la base de datos correctamente');
            } else {
                console.log('El usuario ya está registrado en la base de datos');
            }
        } catch (error) {
            throw new Error('Error al registrar usuario en la base de datos: ' + error.message);
        }
    }



    async saveData(path, data) {
        try {
            await set(ref(this.db, path), data);
        } catch (error) {
            throw new Error('Error al escribir en la base de datos: ' + error.message);
        }
    }

    async getData(path) {
        try {
            const snapshot = await get(ref(this.db, path));
            if (snapshot.exists()) {
                console.log("data: ", snapshot.val());
                return snapshot.val();
            } else {
                throw new Error('No se encontraron datos en la ruta especificada');
            }
        } catch (error) {
            throw new Error('Error al leer de la base de datos: ' + error.message);
        }
    }

    async checkAccessCurrentUserRoutesApp(route) {
        try {
            await this.getData(`routes/${route}`);
            return true; // El usuario tiene acceso a la ruta específica
        } catch (error) {
            return false; // El usuario no tiene acceso a la ruta específica
        }
    }
}

export default new FirebaseService();
