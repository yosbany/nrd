import { showLoaderPage, showLoaderApp, hideLoaderPage, hideLoaderApp } from './util.js'

export default class BaseView {
    constructor() {
        // Constructor de BaseView
    }

    getContent(elementId) {
        return document.getElementById(elementId) ? document.getElementById("elementId").innerHTML : document.createElement("dvi").innerHTML;
    }

    async fetchAndSetHTML(url, targetElementId) {
        
        this.hideLoaderPage();
        this.hideLoaderApp();

        return fetch(url)
            .then(response => response.text())
            .then(html => {
                document.getElementById(targetElementId).innerHTML = this._filterScripts(html);
            });
    }

    _filterScripts(html) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        tempElement.querySelectorAll('script').forEach(script => script.parentNode.removeChild(script));
        return tempElement.innerHTML;
    }

    redirectTo(url) {
        window.location.href = url;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLoaderPage() {
        showLoaderPage();
    }

    showLoaderApp() {
        showLoaderApp();
    }

    hideLoaderPage() {
        hideLoaderPage();
    }
    hideLoaderApp() {
        hideLoaderApp();
    }

    setPageTitleAndHeader(title) {
        const newTitle = "NRD - " + title;
        document.title = newTitle;
        //document.getElementById("pageTitle").innerText = newTitle;
        document.getElementById("mainTitle").innerText = title;
    }

    setSidebarMenu(hash) {
        const sidebarLinks = document.querySelectorAll('#sidebarMenu a.nav-link');
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('#' + hash)) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

}