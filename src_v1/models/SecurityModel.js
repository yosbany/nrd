import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { ref, get, set } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';

const Users = 'Users';
const Permissions = 'Permissions'; // Referencia al nodo de permisos en la base de datos

const errorMessages = {
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/user-not-found': 'No se encontró una cuenta con este correo electrónico.',
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/user-disabled': 'La cuenta ha sido deshabilitada.',
    'auth/network-request-failed': 'Fallo en la red. Por favor, inténtalo de nuevo.',
    'default': 'Ocurrió un error. Por favor, inténtalo de nuevo.'
};

const SecurityModel = {
    user: null,
    roles: [],
    error: null,

    login: (email, password) => {
        console.log(`[Audit][SecurityModel] Attempting login with email: ${email}`);
        return signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                SecurityModel.user = userCredential.user;
                console.log(`[Audit][SecurityModel] Login successful for email: ${email}`);
                return SecurityModel.loadUserRoles().then(() => {
                    return SecurityModel.addUserToDatabaseIfNotExists();
                });
            })
            .catch(error => {
                const message = errorMessages[error.code] || errorMessages['default'];
                SecurityModel.error = message;
                console.error(`[Audit][SecurityModel] Login error for email ${email}: ${error.message}`);
                m.redraw();
            });
    },

    logout: () => {
        console.log("[Audit][SecurityModel] User logging out...");
        return signOut(auth)
            .then(() => {
                SecurityModel.user = null;
                SecurityModel.roles = [];
                console.log("[Audit][SecurityModel] User logged out successfully.");
                m.route.set('/login');
            })
            .catch(error => {
                console.error("[Audit][SecurityModel] Error during logout: ", error.message);
            });
    },

    loadUserRoles: () => {
        if (SecurityModel.user) {
            //console.log(`[Audit][SecurityModel] Loading roles for user: ${SecurityModel.user.uid}`);
            const userRef = ref(db, `${Users}/${SecurityModel.user.uid}`);
            return get(userRef).then(snapshot => {
                if (snapshot.exists()) {
                    SecurityModel.roles = snapshot.val().roles || [];
                    //console.log(`[Audit][SecurityModel] User roles loaded: ${SecurityModel.roles}`);
                    m.redraw();
                } else {
                    //console.warn(`[Audit][SecurityModel] No roles found for user: ${SecurityModel.user.uid}`);
                    SecurityModel.roles = [];
                    m.redraw();
                }
            }).catch(error => {
                //console.error(`[Audit][SecurityModel] Error loading user roles for user ${SecurityModel.user.uid}: ${error.message}`);
                SecurityModel.roles = [];
                m.redraw();
            });
        }
    },

    addUserToDatabaseIfNotExists: () => {
        if (SecurityModel.user) {
            console.log(`[Audit][SecurityModel] Checking if user exists in database: ${SecurityModel.user.uid}`);
            const userRef = ref(db, `${Users}/${SecurityModel.user.uid}`);
            return get(userRef).then(snapshot => {
                if (!snapshot.exists()) {
                    console.log("[Audit][SecurityModel] User does not exist in database, adding...");
                    return set(userRef, {
                        email: SecurityModel.user.email,
                        id: SecurityModel.user.uid,
                        roles: ['User'] // Rol predeterminado para nuevos usuarios
                    }).then(() => {
                        console.log(`[Audit][SecurityModel] User added to database: ${SecurityModel.user.email}`);
                    }).catch(error => {
                        console.error(`[Audit][SecurityModel] Error adding user to database: ${error.message}`);
                    });
                } else {
                    console.log(`[Audit][SecurityModel] User already exists in database: ${SecurityModel.user.email}`);
                }
            });
        }
    },

    isAuthenticated: () => {
        return SecurityModel.user !== null;
    },

    hasRole: roles => {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        return roles.some(role => SecurityModel.roles.includes(role));
    },

    hasAccessToRoute: async route => {
        try {
            const permissionsRef = ref(db, Permissions);
            const snapshot = await get(permissionsRef);

            if (!snapshot.exists()) {
                //console.warn("[Audit][SecurityModel] No permissions array found in database.");
                return false;
            }

            const permissionsArray = snapshot.val();

            // Normalizar la ruta recibida
            const normalizedRoute = SecurityModel.normalizeRoute(route, permissionsArray);

            // Verificación de permisos
            const permission = permissionsArray.find(p => p.path === normalizedRoute);

            if (permission) {
                const allowedRoles = permission.roles || [];
                const hasAccess = SecurityModel.roles.some(role => allowedRoles.includes(role));
                //console.log(`[Audit][SecurityModel] Access check for route: ${normalizedRoute} with roles: ${SecurityModel.roles}, Access granted: ${hasAccess}`);
                return hasAccess;
            } else {
                //console.warn(`[Audit][SecurityModel] No permissions found for route: ${normalizedRoute}`);
                return false;
            }
        } catch (error) {
            console.error(`[Audit][SecurityModel] Error checking access to route ${route}: ${error.message}`);
            return false;
        }
    },
    normalizeRoute: (route, permissionsArray) => {
        for (let permission of permissionsArray) {
            // Crear un patrón de expresión regular para la ruta del permiso
            const routePattern = permission.path.replace(/:\w+/g, '[^/]+'); // Reemplazar los parámetros con :id por una expresión regular que coincida con cualquier segmento
            const routeRegex = new RegExp(`^${routePattern}$`);
    
            // Verificar si la ruta actual coincide con el patrón
            if (route.match(routeRegex)) {
                return permission.path;
            }
        }
        return route; // Si no coincide con ninguna ruta definida, devolver la ruta tal cual
    },
    
    init: () => {
        console.log("[Audit][SecurityModel] Initializing authentication state observer");
        onAuthStateChanged(auth, user => {
            SecurityModel.user = user;
            if (user) {
                console.log(`[Audit][SecurityModel] User authenticated: ${user.uid}`);
                SecurityModel.loadUserRoles().then(() => {
                    SecurityModel.addUserToDatabaseIfNotExists();
                });
            } else {
                console.log("[Audit][SecurityModel] User signed out");
                SecurityModel.roles = [];
                m.redraw();
            }
        });
    }
};

SecurityModel.init();

export default SecurityModel;
