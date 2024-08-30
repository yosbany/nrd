import RouteCoreConfig from '../core/RouteCoreConfig.js';
import RouteAppConfig from './config/RouteAppConfig.js';
import AuthGuard from '../core/AuthGuard.js';
import ErrorBoundary from '../core/ErrorBoundary.js';
import Logger from './utils/Logger.js';

const routes = { ...RouteCoreConfig, ...RouteAppConfig };

Logger.info("[App] Inicializando rutas de la aplicación...");

const App = Object.keys(routes).reduce((acc, path) => {
    acc[path] = {
        onmatch: async (args, requestedPath) => {
            Logger.info(`[App] Intentando coincidir la ruta: ${requestedPath}`);
            try {
                await AuthGuard.onmatch(args, requestedPath); // Verificación de autenticación
            } catch (error) {
                Logger.error(`[App] Error al coincidir la ruta: ${requestedPath}`, error);
                m.route.set('/error', { message: error.message });
            }
        },
        render: vnode => {
            Logger.info(`[App] Renderizando vista para la ruta: ${path}`);
            const renderFunction = routes[path]?.render;
            if (typeof renderFunction === 'function') {
                return m(ErrorBoundary, renderFunction(vnode)); // Se llama directamente a la función `render`
            } else {
                Logger.error(`[App] Función de renderizado no válida para la ruta: ${path}`);
                return m(ErrorBoundary, m('div', 'Componente no válido'));
            }
        }
    };
    return acc;
}, {});

Logger.info("[App] Rutas de la aplicación configuradas exitosamente.");

m.route(document.body, '/', {
    ...App,
    '/*': {
        onmatch: async (args, requestedPath) => {
            Logger.info(`[App] Ruta no encontrada, redirigiendo a /not-found: ${requestedPath}`);
            try {
                await AuthGuard.onmatch(args, requestedPath); // Verificación de autenticación para rutas no encontradas
            } catch (error) {
                Logger.error(`[App] Error en la ruta /not-found: ${requestedPath}`, error);
                m.route.set('/error', { message: error.message });
            }
        },
        render: vnode => {
            Logger.info(`[App] Renderizando vista para la ruta /not-found`);
            const renderFunction = RouteCoreConfig['/not-found']?.render;
            if (typeof renderFunction === 'function') {
                return m(ErrorBoundary, renderFunction(vnode)); // Se llama directamente a la función `render`
            } else {
                Logger.error(`[App] Función de renderizado no válida para la ruta /not-found`);
                return m(ErrorBoundary, m('div', 'Componente no válido'));
            }
        }
    }
});

Logger.info("[App] Navegación inicial configurada.");
