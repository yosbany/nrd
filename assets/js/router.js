import { routes, controllers } from './routes.js';
import { requireAuth } from '../../middleware/auth-middleware.js';

export function handleRoute() {
    const hash = window.location.hash.substring(1);
    console.log("hash:", hash);
    const route = routes[hash];
    const controller = controllers[hash];

    if (!route) {
        window.location.href = '#/not-found';
        return;
    }

    if (hash !== 'login' && hash !== 'access-denied' && hash !== 'not-found') {
        requireAuth();
    }

    loadPage(route, controller, hash);
}

function loadPage(route, controller, hash) {
    if (hash !== 'login' && hash !== 'not-found' && hash !== 'access-denied') {
        fetch(route)
            .then(response => response.text())
            .then(data => {
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
                if (!controller) {
                    import('./controllers/' + controller)
                        .then(module => module.default());
                }

            })
            .catch(error => console.error('Error loading page:', error));
    }
    else {
        window.location.href = route;
    }

}