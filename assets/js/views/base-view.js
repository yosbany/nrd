export default class BaseView {
    constructor() {
        // Constructor de BaseView
    }

    // Método para renderizar un mensaje de error en la vista
    renderError(message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
    }

    async fetchAndSetHTML(url, targetElementId) {
        return fetch(url)
            .then(response => response.text())
            .then(html => {
                document.getElementById(targetElementId).innerHTML = filterScripts(html);
            });
    }

    filterScripts(html) {
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

    toggleElementVisibility(elementId, isVisible) {
        const element = document.getElementById(elementId);
        if (isVisible) {
            element.classList.remove("d-none");
            element.classList.add("d-block");
        } else {
            element.classList.remove("d-block");
            element.classList.add("d-none");
        }
    }

    showLoaderPage() {
        this.toggleElementVisibility("loaderPage", true);
        this.toggleElementVisibility("page", false);
    }

    hideLoaderPage() {
        this.toggleElementVisibility("loaderPage", false);
        this.toggleElementVisibility("page", true);
    }

    showLoaderApp() {
        this.toggleElementVisibility("loaderApp", true);
        this.toggleElementVisibility("app", false);
    }

    hideLoaderApp() {
        this.toggleElementVisibility("loaderApp", false);
        this.toggleElementVisibility("app", true);
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