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

    // Método para limpiar todos los elementos hijos de un elemento padre
    clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}