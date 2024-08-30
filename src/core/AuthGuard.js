import FirebaseAuth from '../app/services/FirebaseAuth.js';
import Logger from '../app/utils/Logger.js';

const AuthGuard = {
    onmatch: async (args, requestedPath) => {
        try {
            // Lista de rutas que no requieren autenticación
            const publicRoutes = ['/login', '/unauthorized', '/404', '/error'];

            // Si la ruta solicitada está en la lista de rutas públicas, no aplicar autenticación
            if (publicRoutes.includes(requestedPath)) {
                Logger.info(`[AuthGuard] Ruta pública accesible sin autenticación: ${requestedPath}`);
                return; // Permitir el acceso sin validar autenticación
            }

            // Verificar si el usuario está autenticado
            const user = FirebaseAuth.getCurrentUser();
            if (!user) {
                Logger.info(`[AuthGuard] Usuario no autenticado, redirigiendo a /login.`);
                return m.route.set('/login'); // Redirigir a la página de login si no hay usuario autenticado
            }

            Logger.info(`[AuthGuard] Usuario autenticado, permitiendo acceso a la ruta: ${requestedPath}`);
        } catch (error) {
            Logger.error('Error during route matching:', error);
            return m.route.set('/error', { message: error.message });
        }
    },

    onerror: (error, requestedPath) => {
        Logger.error('Routing error:', error);
        return m.route.set('/error', { message: error.message });
    }
};

export default AuthGuard;
