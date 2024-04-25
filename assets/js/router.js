import { routes, controllers } from './routes.js';
import { requireAuth } from '../../middleware/auth-middleware.js';

export function handleRoute() {
    const hash = window.location.hash.substring(1);
    const route = routes[hash];
    const controller = controllers[hash];
    if (!route) {
        window.location.href = 'not-found.html';
        return;
    }
    if (hash !== '' && hash !== 'login' && hash !== 'access-denied' && hash !== 'not-found') {
        requireAuth();
    }
    loadPage(route, controller, hash);
}

function fetchHTML(url, targetElementId) {
    return fetch(url)
        .then(response => response.text())
        .then(html => document.getElementById(targetElementId).innerHTML = html);
}

function loadPage(route, controller, hash) {
    console.log(hash, route, controller);

    const allowedHashes = ['', 'login', 'not-found', 'access-denied'];

    if (!allowedHashes.includes(hash)) {
        console.log("route: ",route)
        redirectTo(route);
        return;
    }

    fetchHTML('./pages/' + route, 'app')
        .then(() => {
            const templatePromises = [
                fetchHTML('./templates/header.html', 'header'),
                fetchHTML('./templates/sidebar.html', 'sidebar'),
                fetchHTML('./templates/footer.html', 'footer')
            ];

            return Promise.all(templatePromises);
        })
        .then(() => {
            if (controller) {
                import('./assets/js/controllers/' + controller)
                    .then(module => module.default());
            }
        })
        .catch(error => console.error('Error loading page:', error));
}

function redirectTo(url) {
    window.location.href = url;
}
