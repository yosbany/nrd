import { routes, controllers } from './routes.js';
import { requireAuth } from '../../middleware/auth-middleware.js';

export function handleRoute() {
    const hash = window.location.hash.substring(1);
    const route = routes[hash];
    const controller = controllers[hash];

    if (!route) {
        redirectTo('not-found.html');
    }
    else if (requiresAuthentication(hash)) {
        requireAuth();
    }

    if (isRedirectRoute(hash)) {
        redirectTo(route);
    }
    else {
        loadPage(route, controller);
    }
}

function isRedirectRoute(hash) {
    const allowedHashes = ['', 'login', 'not-found', 'access-denied'];
    return allowedHashes.includes(hash);
}

function requiresAuthentication(hash) {
    return hash !== '' && hash !== 'login' && hash !== 'access-denied' && hash !== 'not-found';
}

function fetchAndSetHTML(url, targetElementId) {
    return fetch(url)
        .then(response => response.text())
        .then(html => document.getElementById(targetElementId).innerHTML = html);
}

function loadPage(route, controller) {
    fetchAndSetHTML(`./pages/${route}`, 'app')
        .then(() => Promise.all([
            fetchAndSetHTML('./templates/header.html', 'header'),
            fetchAndSetHTML('./templates/sidebar.html', 'sidebar'),
            fetchAndSetHTML('./templates/footer.html', 'footer')
        ]))
        .then(() => {
            if (controller) {
                import(`./controllers/${controller}`)
                    .then(module => {
                        module.default();
                    })
                    .catch(error => console.error('Error importing controller:', error));
            }
        })
        .catch(error => console.error('Error loading page:', error));
}

function redirectTo(url) {
    window.location.href = url;
}
