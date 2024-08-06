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
        console.log(`[Audit][SecurityModel] Attempting login with email: ${email}`);
        return signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                SecurityModel.user = userCredential.user;
                console.log(`[Audit][SecurityModel] Login successful for email: ${email}`);
                return SecurityModel.loadUserRole().then(() => {
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
                SecurityModel.role = null;
                console.log("[Audit][SecurityModel] User logged out successfully.");
                m.route.set('/login');
            })
            .catch(error => {
                console.error("[Audit][SecurityModel] Error during logout: ", error.message);
            });
    },

    loadUserRole: () => {
        if (SecurityModel.user) {
            const userRef = ref(db, `users/${SecurityModel.user.uid}`);
            console.log(`[Audit][SecurityModel] Loading role for user: ${SecurityModel.user.uid}`);
            return get(userRef).then(snapshot => {
                if (snapshot.exists()) {
                    SecurityModel.role = snapshot.val().role;
                    console.log(`[Audit][SecurityModel] User role loaded: ${SecurityModel.role}`);
                    m.redraw();
                } else {
                    console.warn(`[Audit][SecurityModel] No role found for user: ${SecurityModel.user.uid}`);
                    SecurityModel.role = null;
                    m.redraw();
                }
            }).catch(error => {
                console.error(`[Audit][SecurityModel] Error loading user role for user ${SecurityModel.user.uid}: ${error.message}`);
                SecurityModel.role = null;
                m.redraw();
            });
        }
    },

    addUserToDatabaseIfNotExists: () => {
        const userRef = ref(db, `users/${SecurityModel.user.uid}`);
        console.log(`[Audit][SecurityModel] Checking if user exists in database: ${SecurityModel.user.uid}`);
        return get(userRef).then(snapshot => {
            if (!snapshot.exists()) {
                console.log("[Audit][SecurityModel] User does not exist in database, adding...");
                return set(userRef, {
                    email: SecurityModel.user.email,
                    id: SecurityModel.user.uid
                }).then(() => {
                    console.log(`[Audit][SecurityModel] User added to database: ${SecurityModel.user.email}`);
                }).catch(error => {
                    console.error(`[Audit][SecurityModel] Error adding user to database: ${error.message}`);
                });
            } else {
                console.log(`[Audit][SecurityModel] User already exists in database: ${SecurityModel.user.email}`);
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
        console.log(`[Audit][SecurityModel] Checking access to entity ${entity} for role ${SecurityModel.role}: ${hasAccess}`);
        return hasAccess;
    },

    assignRole: (userId, role) => {
        const userRef = ref(db, `users/${userId}`);
        console.log(`[Audit][SecurityModel] Assigning role ${role} to user ${userId}`);
        return set(userRef, { role }).then(() => {
            console.log(`[Audit][SecurityModel] Role ${role} assigned to user ${userId}`);
        }).catch(error => {
            console.error(`[Audit][SecurityModel] Error assigning role ${role} to user ${userId}: ${error.message}`);
        });
    },

    init: () => {
        console.log("[Audit][SecurityModel] Initializing authentication state observer");
        onAuthStateChanged(auth, user => {
            SecurityModel.user = user;
            if (user) {
                console.log(`[Audit][SecurityModel] User authenticated: ${user.uid}`);
                SecurityModel.loadUserRole().then(() => {
                    SecurityModel.addUserToDatabaseIfNotExists();
                });
            } else {
                console.log("[Audit][SecurityModel] User signed out");
                SecurityModel.role = null;
                m.redraw();
            }
        });
    }
};

SecurityModel.init();

export default SecurityModel;
