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
}