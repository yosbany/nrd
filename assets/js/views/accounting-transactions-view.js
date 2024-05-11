import BaseView from './base-view.js';

export default class AccountingTransactionsView extends BaseView {

    constructor(controller) {
        super();
        this.controller = controller;
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "accounting-transactions.html", "app");
        this.setPageTitleAndHeader("Movimientos Contables");
        this.initEventView();
    }

    initEventView() {
        document.getElementById('guardarmovimiento').addEventListener('click', () => {

            var datosMovimiento = {
                referencia: "",
                fecha: "",
                contacto: "",
                descripcion: "",
                concepto: "",
                importePago: 0
            };

            // Obtener los valores de los campos de entrada
            datosMovimiento.referencia = document.querySelector('input[type="text"]').value;
            datosMovimiento.fecha = document.querySelector('input[type="date"]').value;
            datosMovimiento.contacto = document.querySelector('select.form-select').value;
            datosMovimiento.descripcion = document.querySelector('textarea.form-control').value;
            datosMovimiento.concepto = document.querySelectorAll('select.form-select')[1].value;
            datosMovimiento.importePago = parseFloat(document.querySelector('input[type="number"]').value);

            // Hacer algo con los datos obtenidos, por ejemplo, imprimirlos en la consola
            console.log(datosMovimiento);

            // Aquí puedes agregar más acciones, como enviar los datos a un servidor o guardarlos en el almacenamiento local.
            this.controller.saveMovimiento(datosMovimiento);
        });
    }


}