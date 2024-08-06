import SecurityModel from '../models/SecurityModel.js';

const ProtectedRoute = {
    oninit: vnode => {
        console.log("[Audit][ProtectedRoute] Initializing ProtectedRoute...");
        if (!SecurityModel.isAuthenticated()) {
            console.log("[Audit][ProtectedRoute] User not authenticated, redirecting to login");
            m.route.set('/login');
        } else if (SecurityModel.role === null && m.route.get() !== '/home') {
            console.log("[Audit][ProtectedRoute] User role not loaded, waiting...");
            SecurityModel.loadUserRole().then(() => {
                if (SecurityModel.role === null) {
                    m.route.set('/home');
                } else if (vnode.attrs.roles && !SecurityModel.hasRole(vnode.attrs.roles)) {
                    console.log("[Audit][ProtectedRoute] User does not have the required role, redirecting to unauthorized");
                    m.route.set('/unauthorized');
                }
            });
        } else if (vnode.attrs.roles && !SecurityModel.hasRole(vnode.attrs.roles)) {
            console.log("[Audit][ProtectedRoute] User does not have the required role, redirecting to unauthorized");
            m.route.set('/unauthorized');
        }
    },
    onbeforeupdate: vnode => {
        console.log("[Audit][ProtectedRoute] Checking authentication and role on route update...");
        if (!SecurityModel.isAuthenticated()) {
            console.log("[Audit][ProtectedRoute] User not authenticated, redirecting to login");
            m.route.set('/login');
            return false;
        }
        if (SecurityModel.role === null && m.route.get() !== '/home') {
            console.log("[Audit][ProtectedRoute] User role not loaded, waiting...");
            SecurityModel.loadUserRole().then(() => {
                if (SecurityModel.role === null) {
                    m.route.set('/home');
                } else if (vnode.attrs.roles && !SecurityModel.hasRole(vnode.attrs.roles)) {
                    console.log("[Audit][ProtectedRoute] User does not have the required role, redirecting to unauthorized");
                    m.route.set('/unauthorized');
                }
            });
            return false;
        }
        if (vnode.attrs.roles && !SecurityModel.hasRole(vnode.attrs.roles)) {
            console.log("[Audit][ProtectedRoute] User does not have the required role, redirecting to unauthorized");
            m.route.set('/unauthorized');
            return false;
        }
        return true;
    },
    view: vnode => {
        if (SecurityModel.isAuthenticated() && (SecurityModel.role !== null || m.route.get() === '/home')) {
            return m('div', vnode.children);
        }
        return null;
    }
};

export default ProtectedRoute;
