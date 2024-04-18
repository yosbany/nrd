/* globals Chart:false, feather:false */

(function () {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  // Obtener la configuración de la gráfica desde el archivo de configuración
  fetch('../configuracion.json')
    .then(response => response.json())
    .then(configuracion => {
      // Crear la gráfica con la configuración obtenida
      var ctx = document.getElementById('myChart')
      new Chart(ctx, {
        type: configuracion.type,
        data: {
          labels: configuracion.labels,
          datasets: [{
            data: configuracion.data,
            lineTension: configuracion.lineTension,
            backgroundColor: configuracion.backgroundColor,
            borderColor: configuracion.borderColor,
            borderWidth: configuracion.borderWidth,
            pointBackgroundColor: configuracion.pointBackgroundColor
          }]
        },
        options: configuracion.options
      })
    })
})()
