import { redirectTo, showLoaderPage, showLoaderApp, hideLoaderPage, hideLoaderApp } from '../util.js'

export default class BaseView {


    constructor() {
        this.PATH_FRAGMENTS = "./assets/js/views/fragments/";
    }

    emitEventController(keyEvent, dataEvent) {
        document.dispatchEvent(new CustomEvent(keyEvent, dataEvent));
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

    redirectToPage(path) {
        redirectTo(path);
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
        this._setSidebarMenu()
    }

    _setSidebarMenu() {
        const hash = window.location.hash.slice(1);
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

    imprimirContenido(contenido) {
        // Crear una ventana emergente con el contenido que se va a imprimir
        const ventanaImpresion = window.open('', '_blank');
        
        // Establecer el contenido HTML a imprimir
        ventanaImpresion.document.write(`<html><head><title>Impresión</title></head><body>${contenido}</body></html>`);
        
        // Forzar la carga de estilos CSS
        ventanaImpresion.document.write(`<style>
            /* Estilos de impresión */
            body { font-family: Arial, sans-serif; }
            /* Ajustar tamaño del papel a 80 mm */
            @media print {
                @page {
                    size: 80mm 100mm; /* Ancho x alto */
                }
            }
        </style>`);
        
        // Imprimir el contenido
        ventanaImpresion.print();
        
        // Cerrar la ventana emergente después de imprimir
        ventanaImpresion.close();
    }

}