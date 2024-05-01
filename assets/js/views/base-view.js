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
        // Crea una nueva ventana de impresión
        const ventanaImpresion = window.open('', '_blank');
    
        // Establece el contenido de la ventana de impresión
        ventanaImpresion.document.write(`
            <html>
            <head>
                <title>Resumen del Pedido</title>
                <style>
                    /* Agrega estilos para la impresión */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    .resumen-pedido {
                        max-width: 80mm; /* Ancho máximo para el papel de 80 mm */
                        font-size: 12px; /* Tamaño de fuente adecuado */
                    }
                </style>
            </head>
            <body>
                <div class="resumen-pedido">
                    ${contenido}
                </div>
            </body>
            </html>
        `);
    
        // Cierra la escritura en el documento de la ventana de impresión
        ventanaImpresion.document.close();
    
        // Imprime el contenido
        ventanaImpresion.print();
    
        // Cierra la ventana después de imprimir
        ventanaImpresion.close();
    }

    

}