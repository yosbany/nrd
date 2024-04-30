import BaseView from './base-view.js';
import LocalStorageModel from '../models/local-storage-model.js';

export default class MakeOrderView extends BaseView {

    constructor() {
        super();
        this.localStorageModel = new LocalStorageModel();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "make-order.html", "app");

        this.proveedores = this.localStorageModel.getValue('proveedores');
        this.proveedorSelect = document.getElementById('proveedorSelect');
        this.productosTableBody = document.getElementById('productosTableBody');

        this.initEventView();

        cargarProveedores();
    }

    initEventView() {
        this.proveedorSelect.addEventListener('change', event => {
            const proveedorSeleccionado = event.target.value;
            this.cargarProductos(proveedorSeleccionado);
        });
    }

    cargarProveedores() {
        this.proveedores.forEach(proveedor => {
            const option = document.createElement('option');
            option.value = proveedor.proveedor;
            option.textContent = proveedor.proveedor;
            this.proveedorSelect.appendChild(option);
        });
    }

    cargarProductos(proveedorSeleccionado) {
        this.productosTableBody.innerHTML = '';

        const proveedor = this.proveedores.find(p => p.proveedor === proveedorSeleccionado);


        if (proveedor) {
            proveedor.productos.forEach(producto => {
                const row = productosTableBody.insertRow();
                row.innerHTML = `
              <td></td>
              <td>${producto.producto}</td>
              <td>${producto.precio}</td>
              <td style="text-align: right;">${producto.stock}</td>
            `;
            });
        }
    }

}