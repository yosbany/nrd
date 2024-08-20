import SecurityModel from '../models/SecurityModel.js';

const ProtectedRoute = {
    oninit: vnode => {
        //console.log("[Audit] Initializing ProtectedRoute...");

        // Si el usuario no está autenticado, redirigir al login
        if (!SecurityModel.isAuthenticated()) {
            //console.log("[Audit] User not authenticated, redirecting to login");
            m.route.set('/login');
            return;
        }

        // Verificar acceso a la ruta actual
        SecurityModel.hasAccessToRoute(m.route.get()).then(hasAccess => {
            if (!hasAccess) {
                //console.log("[Audit] User does not have access to this route, redirecting to unauthorized");
                m.route.set('/unauthorized');
            }
        }).catch(error => {
            //console.error("[Audit] Error checking route access:", error);
            m.route.set('/unauthorized');
        });
    },

    onbeforeupdate: vnode => {
        //console.log("[Audit] Checking authentication on route update...");

        // Si el usuario no está autenticado, redirigir al login
        if (!SecurityModel.isAuthenticated()) {
            //console.log("[Audit] User not authenticated, redirecting to login");
            m.route.set('/login');
            return false;
        }

        // Verificar acceso a la ruta actual
        return SecurityModel.hasAccessToRoute(m.route.get()).then(hasAccess => {
            if (!hasAccess) {
                //console.log("[Audit] User does not have access to this route, redirecting to unauthorized");
                m.route.set('/unauthorized');
                return false;
            }
            return true;
        }).catch(error => {
            //console.error("[Audit] Error checking route access:", error);
            m.route.set('/unauthorized');
            return false;
        });
    },

    view: vnode => {
        if (SecurityModel.isAuthenticated()) {
            return m('div', vnode.children);
        }
        return null; // No renderizar nada si el usuario no está autenticado
    }
};

export default ProtectedRoute;
