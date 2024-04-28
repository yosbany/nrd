import { routes, controllers, titles } from './routes.js';
import { requireAuth } from '../../middleware/auth-middleware.js';

import AccountingTransactionsController from './controllers/accounting-transactions-controller.js';
import BudgetLunchController from './controllers/budget-lunch-controller.js';
import CalculatePriceController from './controllers/calculate-price-controller.js';
import HomeController from './controllers/home-controller.js';
import MakeController from './controllers/make-order-controller.js';
import OnlineCatalogController from './controllers/online-catalog-controller.js';
import PostersController from './controllers/posters-controller.js';
import PrintPriceController from './controllers/print-price-controller.js';
import ProfileController from './controllers/profile-controller.js';
import PurchasePlanController from './controllers/purchase-plan-controller.js';
import PurchasePriceController from './controllers/purchase-price-controller.js';
import ReceiveOrderController from './controllers/receive-order-controller.js';
import RecipeBookController from './controllers/recipe-book-controller.js';
import RrhhController from './controllers/rrhh-controller.js';





function getControllerClass(controller) {
    switch (controller) {
        case 'accounting-transactions-controller.js':
            return AccountingTransactionsController;
        case 'budget-lunch-controller.js':
            return BudgetLunchController;
        case 'calculate-price-controller.js':
            return CalculatePriceController;
        case 'home-controller.js':
            return HomeController;
        case 'make-order-controller.js':
            return MakeController;
        case 'online-catalog-controller.js':
            return OnlineCatalogController;
        case 'posters-a4-controller.js':
            return PostersController;
        case 'print-price-controller.js':
            return PrintPriceController;
        case 'profile-controller.js':
            return ProfileController;
        case 'purchase-plan-controller.js':
            return PurchasePlanController;
        case 'purchase-price-controller.js':
            return PurchasePriceController;
        case 'receive-order-controller.js':
            return ReceiveOrderController;
        case 'recipe-book-controller.js':
            return RecipeBookController;
        case 'rrhh-controller.js':
            return RrhhController;
        default:
            return null;
    }
}

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

async function fetchAndSetHTML(url, targetElementId) {
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
    const sidebarLinks = document.querySelectorAll('#sidebarMenu a.nav-link');
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').includes('#' + hash)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

async function loadPage(route, title, controller, hash) {
    hideLoaderPage();
    showLoaderApp();
    await delay(1000);
    try {
        await fetchAndSetHTML(`./pages/${route}`, 'app');
        setPageTitleAndHeader(title);
        setSidebarMenu(hash);
        console.log('Title and Sidebar updated successfully: ', title);
        if (controller) {
            await loadController(controller);
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
        const ControllerClass = getControllerClass(controller);
        if (ControllerClass) {
            new ControllerClass();
        } else {
            throw new Error(`Controller class not found in ${controller}`);
        }
    } catch (error) {
        console.error('Error loading controller:', error);
    }
}

function redirectTo(url) {
    window.location.href = url;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
