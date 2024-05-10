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
    static instance = null;

    static getInstance() {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseService();
        }
        return FirebaseService.instance;
    }

    constructor() {
        if (!FirebaseService.instance) {
            const app = initializeApp(firebaseConfig);
            this.auth = getAuth(app);
            this.db = getDatabase(app);
            FirebaseService.instance = this;
        }
        return FirebaseService.instance;
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
                    unsubscribe(); 
                    resolve(user);
                }, (error) => {
                    unsubscribe(); 
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
    
            if (!user) {
                throw new Error('No hay usuario autenticado para registrar en la base de datos');
            }
    
            let userData = null;
            try {
                userData = await this.getData(`users/${user.uid}`);
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error.message);
            }
    
            // Verificar si el usuario ya está registrado en la base de datos
            if (userData === null) {
                // El usuario no está registrado, proceder con el registro
                const userDataToSave = {
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid
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
        console.log("routes check: ",`routes/${route}`)
        try {
            //await this.getData(`routes/${route}`);
            const user = await this.getCurrentUser();
            console.log("checkAccessCurrentUserRoutesApp: ", true, user);
            return true;
        } catch (error) {
            console.log("checkAccessCurrentUserRoutesApp: ", false);
            return false;
        }
    }
}

const FirebaseServiceInstance = FirebaseService.getInstance();
export default FirebaseServiceInstance;
