import { routes, controllers, titles } from './routes.js';
import { requireAuth } from '../../middleware/auth-middleware.js';
import HomeController from './controllers/home-controller.js';

export function handleRoute() {
    const hash = window.location.hash.substring(1);
    const route = routes[hash];
    const controller = controllers[hash];
    const title = titles[hash];

    if (!route) {
        redirectTo('not-found.html');
        return;
    }

    if (requiresAuthentication(hash)) {
        requireAuth();
        return;
    }

    if (isRedirectRoute(hash)) {
        showLoader("loaderPage");
        redirectTo(route);
        return;
    }

    loadPage(route, title, controller, hash);
}

function isRedirectRoute(hash) {
    const allowedHashes = ['', 'login', 'not-found', 'access-denied'];
    return allowedHashes.includes(hash);
}

function requiresAuthentication(hash) {
    return hash !== '' && !['login', 'access-denied', 'not-found'].includes(hash);
}

function fetchAndSetHTML(url, targetElementId) {
    return fetch(url)
        .then(response => response.text())
        .then(html => document.getElementById(targetElementId).innerHTML = html);
}

function showLoader(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove("d-none");
        element.classList.add("d-block");
    }
}

function hideLoader(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove("d-block");
        element.classList.add("d-none");
    }
}

function setPageTitleAndHeader(title) {
    const pageTitle = `NRD - ${title}`;
    document.title = pageTitle;
    document.getElementById("pageTitle").innerText = pageTitle;
    document.getElementById("mainTitle").innerText = title;
}

function setSidebarMenu(hash) {
    const sidebarLinks = document.querySelectorAll('#sidebarMenu a.nav-link');

    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(`#${hash}`)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

async function loadPage(route, title, controller, hash) {
    hideLoader("loaderPage");
    showLoader("loaderApp");

    try {
        await fetchAndSetHTML(`./pages/${route}`, 'app');
        setPageTitleAndHeader(title);
        setSidebarMenu(hash);
        console.log('Page loaded successfully:', route);

        if (controller) {
            await loadController(controller);
        }
    } catch (error) {
        console.error('Error loading page:', error);
    } finally {
        hideLoader("loaderApp");
    }
}

async function loadController(controller) {
    try {
        const ControllerClass = getControllerClassName(controller);
        if (ControllerClass) {
            new ControllerClass();
            console.log('Controller loaded successfully:', controller);
        } else {
            throw new Error(`Controller class not found in ${controller}`);
        }
    } catch (error) {
        console.error('Error loading controller:', error);
    }
}

function getControllerClassName(controller) {
    return controller.replace(/\.js$/, '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function redirectTo(url) {
    window.location.href = url;
}
