import MakeController from './controllers/make-order-controller.js';
export default class MakeController {
    constructor() {
        console.log('MakeController constructor called');
        const proveedorData = {
            "PROVEEDOR 1": [
                { producto: "AZUCAR COMUN BOLSA 25KG", precio: "$59", cantidadPorDefecto: 1 },
                { producto: "SAL COMUN BOLSA 25KG", precio: "$134", cantidadPorDefecto: 2 },
                { producto: "HARINA 0 BOLSA 25KG", precio: "$45", cantidadPorDefecto: 3 },
                { producto: "HARINA 0 BOLSA 25KG", precio: "$45", cantidadPorDefecto: 3 },
                { producto: "HARINA 0 BOLSA 25KG", precio: "$45", cantidadPorDefecto: 3 },
                { producto: "HARINA 0 BOLSA 25KG", precio: "$45", cantidadPorDefecto: 3 }
            ],
            "PROVEEDOR 2": [
                { producto: "Producto X", precio: "$15", cantidadPorDefecto: 1 },
                { producto: "Producto Y", precio: "$25", cantidadPorDefecto: 2 }
            ],
            // Define datos para los otros proveedores
        };

        // Obtén referencias a elementos DOM relevantes
        const selectProveedor = document.querySelector('.form-select');
        const tablaProductos = document.querySelector('tbody');
        const resumenPedidoTextarea = document.getElementById('comment');
        const copiarBtn = document.getElementById('copiarBtn');
        const imprimirBtn = document.getElementById('imprimirBtn');

        // Escucha el evento 'change' del selectProveedor
        selectProveedor.addEventListener('change', function () {
            actualizarTabla();
            actualizarResumenPedido();
        });

        actualizarTabla();
        // Ajustar la altura del textarea cuando se cambia su contenido
        resumenPedidoTextarea.addEventListener('input', ajustarAlturaTextarea);

        // Manejar el evento click del botón Copiar
        copiarBtn.addEventListener('click', function () {
            resumenPedidoTextarea.select();
            document.execCommand('copy');
            copiarBtn.textContent = 'Resumen Copiado';
            setTimeout(function () {
                copiarBtn.textContent = 'Copiar';
            }, 5000);
        });

        // Manejar el evento click del botón Imprimir
        imprimirBtn.addEventListener('click', function () {
            const contenido = resumenPedidoTextarea.value;
            if (contenido.trim() !== '') {
                //imprimirContenido(contenido);
            } else {
                console.log('No hay contenido para imprimir.');
            }
        });

        // Función para ajustar dinámicamente la altura del textarea
        function ajustarAlturaTextarea() {
            resumenPedidoTextarea.style.height = 'auto';
            resumenPedidoTextarea.style.height = (resumenPedidoTextarea.scrollHeight + 2) + 'px';
        }

        // Función para actualizar el resumen del pedido
        function actualizarResumenPedido() {
            const productosMarcados = Array.from(tablaProductos.querySelectorAll('input[type="checkbox"]:checked'))
                .map(checkbox => {
                    const row = checkbox.closest('tr');
                    const producto = row.querySelector('td:nth-child(2)').textContent.trim();
                    const cantidad = row.querySelector('input[type="number"]').value || 0;
                    return `${producto} ${cantidad}`;
                });

            const resumen = productosMarcados.length > 0 ? `Pedido - Panadería Nueva Río D'or\n${productosMarcados.join('\n')}` : '';
            resumenPedidoTextarea.value = resumen;

            // Ajustar la altura del textarea después de actualizar el contenido
            ajustarAlturaTextarea();
        }

        // Función para actualizar la tabla con los datos del proveedor seleccionado
        function actualizarTabla() {
            const proveedorSeleccionado = selectProveedor.value;

            // Limpiar la tabla si se selecciona la opción vacía
            if (proveedorSeleccionado === '') {
                tablaProductos.innerHTML = '';
                return; // Salir de la función si se selecciona la opción vacía
            }

            const productos = proveedorData[proveedorSeleccionado];

            // Elimina las filas existentes de la tabla
            tablaProductos.innerHTML = '';

            // Verificar si hay productos disponibles para el proveedor seleccionado
            if (productos && productos.length > 0) {
                // Agrega las nuevas filas a la tabla
                productos.forEach(producto => {
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                  <td style="vertical-align: middle;"><input class="form-check-input" type="checkbox" style="scale: 1.6;"></td>
                  <td style="vertical-align: middle;"><h4 style="margin-bottom: 0px !important;">${producto.producto}</h4></td>
                  <td style="vertical-align: middle;"><span class="badge bg-secondary">${producto.precio}</span></td>
                  <td style="vertical-align: middle;"><input type="number" class="form-control" style="width: 80px;float: right;" disabled value="${producto.cantidadPorDefecto || ''}"></td>
                `;
                    tablaProductos.appendChild(newRow);

                    // Habilitar la columna de cantidad al marcar el checkbox y actualizar el resumen del pedido
                    const checkbox = newRow.querySelector('.form-check-input');
                    const cantidadInput = newRow.querySelector('.form-control');
                    checkbox.addEventListener('change', function () {
                        cantidadInput.disabled = !this.checked;
                        actualizarResumenPedido();
                    });
                });
            } else {
                // Si no hay productos disponibles, mostrar mensaje "No hay registros"
                const noRecordsRow = document.createElement('tr');
                noRecordsRow.innerHTML = `
                <td colspan="4" style="text-align: center;">No hay registros</td>
              `;
                tablaProductos.appendChild(noRecordsRow);
            }
        }
    }
}


