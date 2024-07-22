import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { ref, get, set } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';
import Entities from '../config/Entities.js';

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
    role: null,
    error: null,

    login: (email, password) => {
        console.log(`[Audit] Attempting login with email: ${email}`);
        return signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                SecurityModel.user = userCredential.user;
                console.log(`[Audit] Login successful for email: ${email}`);
                return SecurityModel.loadUserRole().then(() => {
                    return SecurityModel.addUserToDatabaseIfNotExists();
                });
            })
            .catch(error => {
                const message = errorMessages[error.code] || errorMessages['default'];
                SecurityModel.error = message;
                console.error(`[Audit] Login error for email ${email}: ${error.message}`);
                m.redraw();
            });
    },

    logout: () => {
        console.log("[Audit] User logging out...");
        return signOut(auth)
            .then(() => {
                SecurityModel.user = null;
                SecurityModel.role = null;
                console.log("[Audit] User logged out successfully.");
                m.route.set('/login');
            })
            .catch(error => {
                console.error("[Audit] Error during logout: ", error.message);
            });
    },

    loadUserRole: () => {
        if (SecurityModel.user) {
            const userRef = ref(db, `users/${SecurityModel.user.uid}`);
            console.log(`[Audit] Loading role for user: ${SecurityModel.user.uid}`);
            return get(userRef).then(snapshot => {
                if (snapshot.exists()) {
                    SecurityModel.role = snapshot.val().role;
                    console.log(`[Audit] User role loaded: ${SecurityModel.role}`);
                    m.redraw();
                } else {
                    console.warn(`[Audit] No role found for user: ${SecurityModel.user.uid}`);
                    SecurityModel.role = null;
                    m.redraw();
                }
            }).catch(error => {
                console.error(`[Audit] Error loading user role for user ${SecurityModel.user.uid}: ${error.message}`);
                SecurityModel.role = null;
                m.redraw();
            });
        }
    },

    addUserToDatabaseIfNotExists: () => {
        const userRef = ref(db, `users/${SecurityModel.user.uid}`);
        console.log(`[Audit] Checking if user exists in database: ${SecurityModel.user.uid}`);
        return get(userRef).then(snapshot => {
            if (!snapshot.exists()) {
                console.log("[Audit] User does not exist in database, adding...");
                return set(userRef, {
                    email: SecurityModel.user.email,
                    id: SecurityModel.user.uid
                }).then(() => {
                    console.log(`[Audit] User added to database: ${SecurityModel.user.email}`);
                }).catch(error => {
                    console.error(`[Audit] Error adding user to database: ${error.message}`);
                });
            } else {
                console.log(`[Audit] User already exists in database: ${SecurityModel.user.email}`);
            }
        });
    },

    isAuthenticated: () => {
        return SecurityModel.user !== null;
    },

    hasRole: roles => {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        return roles.includes(SecurityModel.role);
    },

    hasAccessToEntity: entity => {
        const entityDef = Entities[entity];
        if (!entityDef) return false;
        const allowedRoles = entityDef.accessibleByRoles || [];
        const hasAccess = SecurityModel.role && allowedRoles.includes(SecurityModel.role);
        console.log(`[Audit] Checking access to entity ${entity} for role ${SecurityModel.role}: ${hasAccess}`);
        return hasAccess;
    },

    assignRole: (userId, role) => {
        const userRef = ref(db, `users/${userId}`);
        console.log(`[Audit] Assigning role ${role} to user ${userId}`);
        return set(userRef, { role }).then(() => {
            console.log(`[Audit] Role ${role} assigned to user ${userId}`);
        }).catch(error => {
            console.error(`[Audit] Error assigning role ${role} to user ${userId}: ${error.message}`);
        });
    },

    init: () => {
        console.log("[Audit] Initializing authentication state observer");
        onAuthStateChanged(auth, user => {
            SecurityModel.user = user;
            if (user) {
                console.log(`[Audit] User authenticated: ${user.uid}`);
                SecurityModel.loadUserRole().then(() => {
                    SecurityModel.addUserToDatabaseIfNotExists();
                });
            } else {
                console.log("[Audit] User signed out");
                SecurityModel.role = null;
                m.redraw();
            }
        });
    }
};

SecurityModel.init();

export default SecurityModel;
