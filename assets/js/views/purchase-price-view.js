import BaseView from './base-view.js';

export default class PurchasePriceView extends BaseView {

    constructor() {
        super();
    }

    async renderView(resultado) {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "purchase-price.html", "app");
        this.setPageTitleAndHeader("Precio Compra");
        this.searchInput = document.getElementById("searchInput");
        this.initEventView();
        this.cargarResultadosEnTabla(resultado);

    }

    initEventView() {
        this.searchInput.addEventListener("input", () => {
            this.filtrarTabla(searchInput.value.toLowerCase());
        });
    }

    async cargarResultadosEnTabla(resultados) {
        try {
          const searchInput = document.getElementById("searchInput");
          // Obtener referencia al tbody de la tabla
          const tbody = document.querySelector('#productosTableBody');
          
          // Limpiar contenido previo de la tabla
          tbody.innerHTML = '';
          
          // Iterar sobre los resultados
          resultados.forEach(resultado => {
            // Crear una nueva fila
            const fila = document.createElement('tr');
            const fechaFormateada = this.formatoFecha(resultado.fecha);
            // Agregar las celdas correspondientes con los datos del resultado
            fila.innerHTML = `
              <td style="vertical-align: middle;">${fechaFormateada}</td>
              <td style="vertical-align: middle;">${resultado.nombre_articulo}</td>
              <td style="vertical-align: middle;">${resultado.razon_social_emisor}</td>
              <td style="vertical-align: middle;"><span class="badge bg-secondary">$ ${resultado.precio_unitario_con_iva}</span></td>
              <td style="vertical-align: middle;"><span class="badge bg-secondary">$ ${resultado.precio_unitario_final}</span></td>
            `;
            
            // Agregar la fila al tbody de la tabla
            tbody.appendChild(fila);
          });
        } catch (error) {
          console.error('Error al cargar resultados en la tabla:', error);
        }
      }

      filtrarTabla(textoBusqueda) {
        try {
            // Obtener referencia al tbody de la tabla
            const tbody = document.querySelector('#productosTableBody');
            const filas = tbody.querySelectorAll('tr');

            // Iterar sobre las filas de la tabla
            filas.forEach(fila => {
                // Obtener el texto de las celdas de la fila
                const textoFila = fila.textContent.toLowerCase();

                // Mostrar u ocultar la fila según si contiene el texto de búsqueda
                fila.style.display = textoFila.includes(textoBusqueda) ? '' : 'none';
            });
        } catch (error) {
            console.error('Error al filtrar la tabla:', error);
        }
    }

    formatoFecha(fecha) {
        const fechaObj = new Date(fecha);
        const dia = fechaObj.getDate().toString().padStart(2, '0');
        const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaObj.getFullYear();
        const horas = fechaObj.getHours().toString().padStart(2, '0');
        const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
        const segundos = fechaObj.getSeconds().toString().padStart(2, '0');
        return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
    }
}