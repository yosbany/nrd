import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import UsersModel from '../models/UsersModel.js'; // Importar el modelo de usuario
import Logger from '../utils/Logger.js';
import FirebaseAppConfig from '../config/FirebaseAppConfig.js';

const FirebaseAuth = {
    auth: getAuth(FirebaseAppConfig),
    currentUser: null,
    userRoles: [],

    initialize() {
        onAuthStateChanged(FirebaseAuth.auth, user => {
            if (user) {
                FirebaseAuth.currentUser = user;
                FirebaseAuth.loadUserRoles(user.uid);
            } else {
                FirebaseAuth.currentUser = null;
                FirebaseAuth.userRoles = [];
            }
        });
    },

    async login(email, password) {
        try {
            Logger.info('[FirebaseAuth] Intentando iniciar sesión con el email: ' + email);
            const userCredential = await signInWithEmailAndPassword(FirebaseAuth.auth, email, password);
            FirebaseAuth.currentUser = userCredential.user;
            await FirebaseAuth.loadUserRoles(FirebaseAuth.currentUser.uid);
            Logger.info('[FirebaseAuth] Usuario autenticado con éxito');
            return FirebaseAuth.currentUser;
        } catch (error) {
            Logger.error('[FirebaseAuth] Falló el inicio de sesión', error);
            throw error;
        }
    },

    async logout() {
        try {
            Logger.info('[FirebaseAuth] Intentando cerrar sesión');
            await signOut(FirebaseAuth.auth);
            FirebaseAuth.currentUser = null;
            FirebaseAuth.userRoles = [];
            Logger.info('[FirebaseAuth] Usuario cerró sesión con éxito');
        } catch (error) {
            Logger.error('[FirebaseAuth] Falló el cierre de sesión', error);
            throw error;
        }
    },

    async register(email, password, role = 'User') {
        try {
            Logger.info('[FirebaseAuth] Intentando registrar un nuevo usuario con el email: ' + email);
            const userCredential = await createUserWithEmailAndPassword(FirebaseAuth.auth, email, password);
            FirebaseAuth.currentUser = userCredential.user;

            // Guardar la información del usuario y sus roles usando UsersModel
            await UsersModel.save(FirebaseAuth.currentUser.uid, {
                email: email,
                roles: [role]
            });

            FirebaseAuth.userRoles = [role];
            Logger.info('[FirebaseAuth] Usuario registrado con éxito con el rol: ' + role);
            return FirebaseAuth.currentUser;
        } catch (error) {
            Logger.error('[FirebaseAuth] Falló el registro de usuario', error);
            throw error;
        }
    },

    getCurrentUser() {
        return FirebaseAuth.currentUser;
    },

    async getUserRoles() {
        return FirebaseAuth.userRoles;
    },

    async loadUserRoles(uid) {
        try {
            // Usar el método getUserRoles del UsersModel para cargar los roles del usuario
            const id = `Users/${uid}`
            const roles = await UsersModel.getUserRoles(id);
            FirebaseAuth.userRoles = roles.length ? roles : [];
            Logger.info(`[FirebaseAuth] Roles del usuario cargados: ${FirebaseAuth.userRoles.join(', ')}`);
        } catch (error) {
            Logger.error('[FirebaseAuth] Falló al cargar los roles del usuario', error);
            throw error;
        }
    },

    isAuthenticated() {
        const isAuthenticated = FirebaseAuth.currentUser !== null;
        Logger.info(`[FirebaseAuth] Verificación de autenticación: ${isAuthenticated}`);
        return isAuthenticated;
    }
};

FirebaseAuth.initialize();

export default FirebaseAuth;
