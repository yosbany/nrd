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
        this.resumenPedidoTextarea = document.getElementById('comment');
        this.copiarBtn = document.getElementById('copiarBtn');
        this.imprimirBtn = document.getElementById('imprimirBtn');

        this.initEventView();

        this.cargarProveedores();
        this.cargarProductos();
    }

    initEventView() {
        this.proveedorSelect.addEventListener('change', event => {
            const proveedorSeleccionado = event.target.value;
            this.cargarProductos(proveedorSeleccionado);
            this.actualizarResumenPedido();
        });
        this.copiarBtn.addEventListener('click', () => {
            this.resumenPedidoTextarea.select();
            document.execCommand('copy');
            this.copiarBtn.textContent = 'Resumen Copiado';
            setTimeout(function () {
                this.copiarBtn.textContent = 'Copiar';
            }, 5000);
        });
        this.imprimirBtn.addEventListener('click', () => {
            const contenido = this.resumenPedidoTextarea.value;
            if (contenido.trim() !== '') {
                //imprimirContenido(contenido);
            } else {
                console.log('No hay contenido para imprimir.');
            }
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
              <td style="vertical-align: middle;"><input class="form-check-input" type="checkbox" style="scale: 1.6;"></td>
              <td style="vertical-align: middle;"><h4 style="margin-bottom: 0px !important;">${producto.producto}</h4></td>
              <td style="vertical-align: middle;"><span class="badge bg-secondary">$ ${producto.precio}</span></td>
              <td style="text-align: right;"><input type="number" class="form-control" style="width: 80px;float: right;" value=${producto.stock}></td>
            `;
                const checkbox = row.querySelector('.form-check-input');
                const cantidadInput = row.querySelector('.form-control');
                checkbox.addEventListener('change', (event) => {
                    cantidadInput.disabled = !this.checked;
                    this.actualizarResumenPedido();
                });
            });
        }
        else {
            const noRecordsRow = document.createElement('tr');
            noRecordsRow.innerHTML = `
            <td colspan="4" style="text-align: center;">No hay registros</td>
          `;
            this.productosTableBody.appendChild(noRecordsRow);
        }
    }

    actualizarResumenPedido() {
        const productosMarcados = Array.from(this.productosTableBody.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => {
                const row = checkbox.closest('tr');
                const producto = row.querySelector('td:nth-child(2)').textContent.trim();
                const cantidad = row.querySelector('input[type="number"]').value || 0;
                return `${producto}  - ${cantidad}`;
            });

        const resumen = productosMarcados.length > 0 ? `Pedido - Panadería Nueva Río D'or\n${productosMarcados.join('\n')}` : '';
        this.resumenPedidoTextarea.value = resumen;
        this.ajustarAlturaTextarea();
    }

    ajustarAlturaTextarea() {
        this.resumenPedidoTextarea.style.height = 'auto';
        this.resumenPedidoTextarea.style.height = (this.resumenPedidoTextarea.scrollHeight + 2) + 'px';
    }

}