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
        showLoader();
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
    document.getElementById("loader").classList.remove("d-none");
    document.getElementById("loader").classList.add("d-block");
    document.getElementById("app").classList.remove("d-block");
    document.getElementById("app").classList.add("d-none");
}

function hideLoader() {
    document.getElementById("loader").classList.remove("d-block");
    document.getElementById("loader").classList.add("d-none");
    document.getElementById("app").classList.remove("d-none");
    document.getElementById("app").classList.add("d-block");
}

function setPageTitleAndHeader(title) {
    document.title = "NRD - " + title;
    document.getElementById("pageTitle").innerText = document.title;
    document.getElementById("mainTitle").innerText = title;
}

function loadPage(route, title, controller) {
    showLoader();

    fetchAndSetHTML(`./pages/${route}`, 'app')
        .then(() => {
            setPageTitleAndHeader(title);
        })
        .then(() => {
            console.log('Title updated successfully: ', title);
        })
        .then(() => {
            if (controller) {
                return loadController(controller);
            }
        })
        .then(() => {
            console.log('Controller loaded successfully: ', controller);
        })
        .catch(error => {
            console.error('Error loading page ' + route + ': ', error);
        })
        .finally(() => {
            console.log('Page loaded successfully: ', route);
            hideLoader();
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
