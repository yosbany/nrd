import { routes, controllers } from './routes.js';
import { requireAuth } from '../../middleware/auth-middleware.js';

export function handleRoute() {
    const hash = window.location.hash.substring(1);
    const route = routes[hash];
    const controller = controllers[hash];

    if (!route || !controller) {
        // Ruta no encontrada, redirige a una página de error 404
        window.location.href = '#/not-found';
        return;
    }

    // Protege rutas que requieren autenticación
    if (hash !== 'login' && hash !== 'access-denied' && hash !== 'not-found') {
        requireAuth();
    }

    loadPage(route, controller);
}

function loadPage(route, controller) {
    fetch(route)
        .then(response => response.text())
        .then(data => {
            document.getElementById('app').innerHTML = data;

            // Cargar encabezado y pie de página
            fetch('templates/header.html')
                .then(response => response.text())
                .then(header => document.getElementById('header').innerHTML = header);

            fetch('templates/footer.html')
                .then(response => response.text())
                .then(footer => document.getElementById('footer').innerHTML = footer);

            import('./controllers/${controller}')
                .then(module => module.default());
        })
        .catch(error => console.error('Error loading page:', error));
}