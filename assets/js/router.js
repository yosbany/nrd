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
    const hash = window.location.hash.substring(1);
    fetch(route)
        .then(response => response.text())
        .then(data => {
            if (hash !== 'login' && hash !== 'not-found' && hash !== 'access-denied') {

                document.getElementById('app').innerHTML = data;

                fetch('templates/header.html')
                    .then(response => response.text())
                    .then(header => document.getElementById('header').innerHTML = header);

                fetch('templates/sidebar.html')
                    .then(response => response.text())
                    .then(sidebar => document.getElementById('sidebar').innerHTML = sidebar);

                fetch('templates/footer.html')
                    .then(response => response.text())
                    .then(footer => document.getElementById('footer').innerHTML = footer);

                import('./controllers/' + controller)
                    .then(module => module.default());
            }

        })
        .catch(error => console.error('Error loading page:', error));
}