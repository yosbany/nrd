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

        this.cargarProveedores();
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
              <td style="vertical-align: middle;"><input class="form-check-input" type="checkbox" checked style="scale: 1.6;"></td>
              <td style="vertical-align: middle;"><h4 style="margin-bottom: 0px !important;">${producto.producto}</h4></td>
              <td style="vertical-align: middle;"><span class="badge bg-secondary">$ ${producto.precio}</span></td>
              <td style="text-align: right;"><input type="number" class="form-control" style="width: 80px;float: right;" value=${producto.stock}></td>
            `;
            });
        }
    }

}