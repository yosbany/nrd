export default class XmlProcessorModel {

    constructor() {

    }

    async procesarXML(url) {
        try {
            // Realizar solicitud fetch para obtener el contenido del archivo XML
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo XML ${url}`);
            }

            // Obtener el texto del archivo XML
            const xmlText = await response.text();

            // Crear un nuevo analizador XML
            const parser = new DOMParser();

            // Analizar el XML
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            // Obtener los nodos necesarios
            const items = xmlDoc.getElementsByTagName("Item");

            // Array para almacenar los resultados de este XML
            const resultados = [];

            // Iterar sobre los nodos de Item
            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                // Obtener los valores de los tags requeridos
                const rutEmisor = xmlDoc.querySelector("RUCEmisor").textContent;
                const razonSocialEmisor = xmlDoc.querySelector("RznSoc").textContent;
                const nombreArticulo = item.querySelector("NomItem").textContent;
                const precioUnitarioSinIVA = parseFloat(item.querySelector("PrecioUnitario").textContent);
                const iva = parseFloat(item.querySelector("IndFact").textContent);

                // Calcular el precio unitario con IVA
                let precioUnitarioConIVA;
                if (iva === 3) {
                    // Si IndFact es 3, entonces el IVA es del 22%
                    precioUnitarioConIVA = precioUnitarioSinIVA * 1.22;
                } else if (iva === 2) {
                    // Si IndFact es 2, entonces el IVA es del 10%
                    precioUnitarioConIVA = precioUnitarioSinIVA * 1.1;
                }

                // Crear objeto con la información recolectada
                const itemObj = {
                    rut_emisor: rutEmisor,
                    razon_social_emisor: razonSocialEmisor,
                    nombre_articulo: nombreArticulo,
                    precio_unitario_sin_iva: precioUnitarioSinIVA,
                    iva: iva,
                    precio_unitario_con_iva: precioUnitarioConIVA
                };

                // Agregar objeto al array de resultados
                resultados.push(itemObj);
            }

            return resultados;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async procesarListaXMLs(listaXMLs) {
        // Array para almacenar todas las promesas de procesamiento de XML
        const promesas = listaXMLs.map(procesarXML);

        try {
            // Esperar a que todas las promesas se resuelvan
            const resultados = await Promise.all(promesas);

            // Devolver todos los resultados
            return resultados.flat();
        } catch (error) {
            console.error("Error al procesar los archivos XML:", error);
            return [];
        }
    }
}