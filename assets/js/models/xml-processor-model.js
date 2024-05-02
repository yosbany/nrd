export default class XmlProcessorModel {
    constructor(pathBase) {
        this.pathBase = pathBase;
    }

    itemNoInclude(item) {
        return [
            'Redondeo',
            'Ajuste por Redonde',
            '(Red) Redondeo',
            'REDONDEO'
        ].includes(item);
    }
    proovedorNoInclude(proveedor) {
        return [
            'Monte Real Srl',
            'MARTINEZ Y CIA SRL',
            'COMPAÑIA URUGUAYA DE MEDIOS DE PROCESAMIENTO S.A.',
            'DELIVERY HERO URUGUAY MARKETPLACE S.A.',
            'HOMECENTER SODIMAC S.A'
        ].includes(proveedor);
    }

    async procesarXML(url) {
        try {
            const path = this.pathBase + url;
            // Realizar solicitud fetch para obtener el contenido del archivo XML
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo XML ${path}`);
            }

            // Obtener el texto del archivo XML
            const xmlText = await response.text();

            // Crear un nuevo analizador XML
            const parser = new DOMParser();

            // Analizar el XML
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            // Obtener el elemento <eFact>
            const eFact = xmlDoc.querySelector('nsAd\\:eFact, eFact');

            if (!eFact) {
                console.log("No existe eFact en: " + url)
                return [];
            }

            // Obtener los nodos Item dentro del tag <eFact>
            const items = eFact.querySelectorAll('nsAd\\:Item, Item');

            // Array para almacenar los resultados de este XML
            const resultados = [];


            const fecha = xmlDoc.querySelector('nsAd\\:Fecha, Fecha').textContent;
            const rutEmisor = eFact.querySelector('nsAd\\:RUCEmisor, RUCEmisor').textContent;
            const razonSocialEmisor = eFact.querySelector('nsAd\\:RznSoc, RznSoc').textContent;

            // Iterar sobre los nodos de Item
            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                // Obtener los valores de los tags requeridos
                const nombreArticulo = item.querySelector('nsAd\\:NomItem, NomItem').textContent;
                const precioUnitarioSinIVA = parseFloat(item.querySelector('nsAd\\:PrecioUnitario, PrecioUnitario').textContent);
                const iva = parseFloat(item.querySelector('nsAd\\:IndFact, IndFact').textContent);

                // Calcular el precio unitario con IVA
                let precioUnitarioConIVA;
                if (iva === 3) {
                    // Si IndFact es 3, entonces el IVA es del 22%
                    precioUnitarioConIVA = (precioUnitarioSinIVA * 1.22).toFixed(2);
                } else if (iva === 2) {
                    // Si IndFact es 2, entonces el IVA es del 10%
                    precioUnitarioConIVA = (precioUnitarioSinIVA * 1.1).toFixed(2);
                } else {
                    // Si IndFact no es ni 3 ni 2, el precio con IVA es igual al precio sin IVA
                    precioUnitarioConIVA = precioUnitarioSinIVA.toFixed(2);
                }

                // Crear objeto con la información recolectada
                const itemObj = {
                    rut_emisor: rutEmisor,
                    razon_social_emisor: razonSocialEmisor,
                    nombre_articulo: nombreArticulo,
                    precio_unitario_sin_iva: precioUnitarioSinIVA,
                    iva: iva,
                    precio_unitario_con_iva: precioUnitarioConIVA,
                    precio_unitario_final: precioUnitarioConIVA,
                    fecha: fecha
                };
                if (!this.itemNoInclude(nombreArticulo) || !this.proovedorNoInclude(razonSocialEmisor)) {
                    resultados.push(itemObj);
                }
                // Agregar objeto al array de resultados

            }

            // Devolver resultados junto con la URL base del archivo XML
            return resultados;
        } catch (error) {
            console.log(url)
            console.error(error);
            return [];
        }
    }


    async procesarListaXMLs(listaXMLs) {
        // Array para almacenar todas las promesas de procesamiento de XML
        const promesas = listaXMLs.map(this.procesarXML.bind(this));

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
