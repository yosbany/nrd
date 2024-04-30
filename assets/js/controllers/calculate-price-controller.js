import BaseController from './base-controller.js';
import CalculatePriceView from '../views/calculate-price-view.js';

export default class CalculatePriceController extends BaseController {
    constructor() {
        super();
        this.view = new CalculatePriceView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async calculatePrice() {
        console.log("CalculatePriceController calculatePrice");
        this.view.renderView();
    }

    _calcularPrecio() {
        const precioInput = document.getElementById('precio');
        const impuestosCheckbox = document.getElementById('impuestosIncluidos');
        const tipoVentaSelect = document.getElementById('tipoVenta');
        const unidadesInput = document.getElementById('unidades');
        const margenInput = document.getElementById('margen');

        precioInput.addEventListener('input', calcularPrecio);
        impuestosCheckbox.addEventListener('change', calcularPrecio);
        tipoVentaSelect.addEventListener('change', calcularPrecio);
        unidadesInput.addEventListener('input', calcularPrecio);
        margenInput.addEventListener('input', calcularPrecio);

        this.calcularPrecio();
        const costoInput = document.getElementById('costo');
        const gananciasInput = document.getElementById('ganancias');
        const precioFinalInput = document.getElementById('precioFinal');
        const veintePorcientoInput = document.getElementById('veintePorciento');
        const veinticincoPorcientoInput = document.getElementById('veinticincoPorciento');
        const treintaPorcientoInput = document.getElementById('treintaPorciento');

        const precio = parseFloat(precioInput.value);
        const unidades = parseFloat(unidadesInput.value);
        const margen = parseFloat(margenInput.value) / 100;
        const impuestosIncluidos = impuestosCheckbox.checked;

        let tipoVenta = 0;
        if (impuestosIncluidos) {
            tipoVenta = parseFloat(tipoVentaSelect.value);
        }

        const impuestos = impuestosIncluidos ? 1 : 1.1; // 1.1 para impuestos incluidos, 1 para no incluidos

        const costo = (precio / unidades) + (precio / unidades * tipoVenta);
        const precioFinal = costo / (1 - margen); // Precio de venta final
        const ganancias = precioFinal - costo; // Ganancias

        costoInput.value = costo.toFixed(2);
        gananciasInput.value = ganancias.toFixed(2);
        precioFinalInput.value = precioFinal.toFixed(2);
        veintePorcientoInput.value = (precioFinal * 0.2).toFixed(2);
        veinticincoPorcientoInput.value = (precioFinal * 0.25).toFixed(2);
        treintaPorcientoInput.value = (precioFinal * 0.3).toFixed(2);
    }
}

