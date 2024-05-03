import BaseView from './base-view.js';
import LocalStorageModel from '../models/local-storage-model.js';

export default class MakeOrderView extends BaseView {

    constructor() {
        super();
        this.localStorageModel = new LocalStorageModel();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "make-order.html", "app");

        this.setPageTitleAndHeader("Realizar Pedido");

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
                this.imprimirContenido(contenido);
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
                const row = this.productosTableBody.insertRow();
                row.innerHTML = `
                  <td style="vertical-align: middle;"><input class="form-check-input" type="checkbox" style="scale: 1.6;"></td>
                  <td style="vertical-align: middle;"><h5 data-bs-toggle="tooltip" title="COMPRAS X ${producto.contenido}" style="margin-bottom: 0px !important;cursor: pointer;" data-bind="${producto.contenido}">${producto.producto}</h5></td>
                  <td style="vertical-align: middle;"><span class="badge bg-secondary">$ ${producto.precio}</span></td>
                  <td style="text-align: right;"><input type="number" class="form-control" style="width: 80px;float: right;" disabled value=${producto.stock}></td>
                `;
                const checkbox = row.querySelector('.form-check-input');
                const cantidadInput = row.querySelector('.form-control');
                const productoH5 = row.cells[1];

                checkbox.addEventListener('change', () => {
                    cantidadInput.disabled = !checkbox.checked;
                    cantidadInput.readOnly = !checkbox.checked;
                    this.actualizarResumenPedido();
                });
                cantidadInput.addEventListener('input', () => {
                    this.actualizarResumenPedido();
                });
                cantidadInput.addEventListener('focus', () => {
                    cantidadInput.value = '';
                });
                cantidadInput.addEventListener('blur', () => {
                    if (cantidadInput.value === '') {
                        cantidadInput.value = producto.stock;
                    }
                });

                productoH5.addEventListener('click', () => {
                    console.log('Producto clickeado');
                    if (row.style.backgroundColor === 'lightgreen') {
                        row.style.backgroundColor = ''; // Restaurar color original
                    } else {
                        row.style.backgroundColor = 'lightgreen'; // Cambiar a color diferente
                    }
                });

            });
        } else {
            const noRecordsRow = document.createElement('tr');
            noRecordsRow.innerHTML = `
                <td colspan="4" style="text-align: center;">No hay registros</td>
            `;
            this.productosTableBody.appendChild(noRecordsRow);
        }
    }


    actualizarResumenPedido() {
        const proveedorSeleccionado = this.proveedorSelect.value;
        const fechaActual = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const productosMarcados = Array.from(this.productosTableBody.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => {
                const row = checkbox.closest('tr');
                const producto = row.querySelector('td:nth-child(2)').textContent.trim();
                const cantidad = row.querySelector('input[type="number"]').value || 0;
                const elementWithDataBind = row.querySelector('[data-bind]');
                const contenido = elementWithDataBind ? elementWithDataBind.getAttribute('data-bind') : '';
                return `${cantidad} ${contenido} DE ${producto}`;
            });

        let resumen = '';
        if (productosMarcados.length > 0) {
            resumen += `Pedido - Nueva Río D'or\n`;
            resumen += `${proveedorSeleccionado}\n`;
            resumen += `Fecha: ${fechaActual}\n\n`;
            resumen += `${productosMarcados.join('\n')}\n`;
        }

        this.resumenPedidoTextarea.value = resumen;
        this.ajustarAlturaTextarea();
    }


    ajustarAlturaTextarea() {
        this.resumenPedidoTextarea.style.height = 'auto';
        this.resumenPedidoTextarea.style.height = (this.resumenPedidoTextarea.scrollHeight + 2) + 'px';
    }

}