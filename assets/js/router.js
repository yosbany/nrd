import { routes, controllers, titles } from './routes.js';
import { requireAuth } from '../../middleware/auth-middleware.js';

export function handleRoute() {
    const hash = window.location.hash.substring(1);
    const route = routes[hash];
    const controller = controllers[hash];
    const title = titles[hash];

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
        loadPage(route, title, controller);
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

function showLoader() {
    document.getElementById("loader").style.display = "block";
    document.getElementById("page").style.display = "none";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("page").style.display = "block";
}

function setPageTitleAndHeader(title) {
    document.title = "NRD - " + title;
    document.getElementById("pageTitle").innerText = title;
    document.getElementById("mainTitle").innerText = title;
}

function loadPage(route, title, controller) {
    showLoader()
    fetchAndSetHTML(`./pages/${route}`, 'app')
        .then(() => Promise.all([
            fetchAndSetHTML('./templates/header.html', 'header'),
            fetchAndSetHTML('./templates/sidebar.html', 'sidebar'),
            fetchAndSetHTML('./templates/footer.html', 'footer')
        ])).
        then(() => {
            setPageTitleAndHeader(title);
        })
        .then(() => {
            if (controller) {
                loadController(controller);
            }
        })
        .then(() => {
            hideLoader();
            console.log('page loaded successfully');
        })
        .catch(error => {
            hideLoader();
            console.error('Error loading page:', error);
        });
}

function loadController(controller) {
    // Elimina el controlador actual si existe
    const currentScript = document.getElementById('currentScript');
    if (currentScript) {
        currentScript.remove();
    }
    // Cargar el nuevo controlador dinámicamente
    const script = document.createElement('script');
    script.src = `./assets/js/controllers/${controller}`;
    script.id = 'currentScript';
    script.type = 'module';
    document.body.appendChild(script);
}

function redirectTo(url) {
    window.location.href = url;
}
