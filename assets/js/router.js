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
        showLoaderPage();
        redirectTo(route);
    }
    else {
        loadPage(route, title, controller, hash);
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

function showLoaderPage() {
    document.getElementById("loaderPage").classList.remove("d-none");
    document.getElementById("loaderPage").classList.add("d-block");
    document.getElementById("page").classList.remove("d-block");
    document.getElementById("page").classList.add("d-none");
}

function hideLoaderPage() {
    document.getElementById("loaderPage").classList.remove("d-block");
    document.getElementById("loaderPage").classList.add("d-none");
    document.getElementById("page").classList.remove("d-none");
    document.getElementById("page").classList.add("d-block");
}

function showLoaderApp() {
    document.getElementById("loaderApp").classList.remove("d-none");
    document.getElementById("loaderApp").classList.add("d-block");
    document.getElementById("app").classList.remove("d-block");
    document.getElementById("app").classList.add("d-none");
}

function hideLoaderApp() {
    document.getElementById("loaderApp").classList.remove("d-block");
    document.getElementById("loaderApp").classList.add("d-none");
    document.getElementById("app").classList.remove("d-none");
    document.getElementById("app").classList.add("d-block");
}

function setPageTitleAndHeader(title) {
    document.title = "NRD - " + title;
    document.getElementById("pageTitle").innerText = document.title;
    document.getElementById("mainTitle").innerText = title;
}

function setSidebarMenu(hash) {
    // Busca todos los elementos <a> dentro del div con id sidebarMenu
    const sidebarLinks = document.querySelectorAll('#sidebarMenu a.nav-link');

    // Itera sobre los elementos encontrados
    sidebarLinks.forEach(link => {
        // Verifica si el href del enlace contiene '#home'
        if (link.getAttribute('href') && link.getAttribute('href').includes('#' + hash)) {
            // Agrega la clase 'active'
            link.classList.add('active');
            // Agrega la propiedad 'aria-current="page"'
            link.setAttribute('aria-current', 'page');
        } else {
            // Si no contiene '#home', elimina la clase 'active'
            link.classList.remove('active');
            // Elimina la propiedad 'aria-current'
            link.removeAttribute('aria-current');
        }
    });
}

async function loadPage(route, title, controller, hash) {
    hideLoaderPage();
    showLoaderApp();

    try {
        await fetchAndSetHTML(`./pages/${route}`, 'app');
        setPageTitleAndHeader(title);
        setSidebarMenu(hash);

        console.log('Title and Sidebar updated successfully: ', title);

        if (controller) {
            await loadController(controller);
            console.log('Controller loaded successfully: ', controller);
        }

        console.log('Page loaded successfully: ', route);
    } catch (error) {
        console.error('Error loading page ' + route + ': ', error);
    } finally {
        hideLoaderApp();
    }
}

async function loadController(controller) {
    try {
        // Elimina el controlador actual si existe
        const currentScript = document.getElementById('currentScript');
        if (currentScript) {
            currentScript.remove();
        }

        // Cargar el nuevo controlador dinámicamente
        const response = await fetch(`./assets/js/controllers/${controller}`);
        if (!response.ok) {
            throw new Error('Failed to load controller script');
        }
        const scriptCode = await response.text();
        const scriptElement = document.createElement('script');
        scriptElement.id = 'currentScript';
        scriptElement.type = 'module';
        scriptElement.textContent = scriptCode;
        document.body.appendChild(scriptElement);

        // Esperar un breve momento para asegurarse de que el script se ha ejecutado completamente
        await new Promise(resolve => setTimeout(resolve, 100));

        // Inicializar la clase controladora después de cargar el script
        const controllerWithoutExtension = controller.replace(/\.js$/, '');
        const controllerClassName = controllerWithoutExtension.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        console.log(controllerClassName);
        const ControllerClass = window[controllerClassName];
        if (ControllerClass && typeof ControllerClass.init === 'function') {
            ControllerClass.init(); // Llama al método init() de la clase controladora
        } else {
            throw new Error(`Error: clase controladora o método init no encontrados en ${controller}`);
        }
    } catch (error) {
        console.error('Error loading controller:', error);
    }
}

function redirectTo(url) {
    window.location.href = url;
}
