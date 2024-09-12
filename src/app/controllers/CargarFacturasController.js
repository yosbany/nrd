import CodiguerasModel from '../models/CodiguerasModel.js';
import ProductsModel from '../models/ProductsModel.js';
import PurchasePricesModel from '../models/PurchasePricesModel.js';
import SuppliersModel from '../models/SuppliersModel.js';
import Logger from '../utils/Logger.js';

const CargarFacturasController = {
    async oninit(vnode) {
        try {
            Logger.info("[Audit][CargarFacturasController] Initialized.");
            vnode.state.items = [];
            vnode.state.isProcessing = false;
            vnode.state.errorFiles = [];
            vnode.state.totalItems = 0; // Contador de registros
            m.redraw();
        } catch (error) {
            Logger.error("[Audit][CargarFacturasController] Error during initialization:", error);
            m.redraw();
        }
    },

    async procesarArchivos(vnode) {
        Logger.info("[Audit][CargarFacturasController] Starting to process files...");
        vnode.state.isProcessing = true;
        vnode.state.items = [];
        vnode.state.errorFiles = [];
        vnode.state.totalItems = 0;

        // Cargar todos los proveedores de una vez
        const suppliers = await SuppliersModel.findAll();

        const allItems = [];

        const processFile = async (file) => {
            Logger.info(`[Audit][CargarFacturasController] Processing file: ${file.name}`);
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async function(event) {
                    try {
                        Logger.info(`[Audit][CargarFacturasController] Successfully read file: ${file.name}`);
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(event.target.result, "text/xml");

                        // Validaciones de los elementos en el XML
                        let eFactElement = xmlDoc.getElementsByTagName("eFact")[0];
                        let prefix = "";
                        if (!eFactElement) {
                            prefix = "nsAd:";
                            eFactElement = xmlDoc.getElementsByTagName(prefix + "eFact")[0];
                        } else if (!eFactElement) {
                            prefix = "ns0:";
                            eFactElement = xmlDoc.getElementsByTagName(prefix + "eFact")[0];
                        }

                        if (!eFactElement) throw new Error("Falta el elemento eFact");

                        let tagEncabezado = prefix + "Encabezado";
                        let tagRUCEmisor = prefix + "RUCEmisor";
                        let tagRznSoc = prefix + "RznSoc";
                        let tagFchEmis = prefix + "FchEmis";
                        let tagSerie = prefix + "Serie";
                        let tagNro = prefix + "Nro";
                        let tagDetalle = prefix + "Detalle";
                        let tagItem = prefix + "Item";
                        let tagCod = prefix + "Cod";
                        let tagIndFact = prefix + "IndFact";
                        let tagNomItem = prefix + "NomItem";
                        let tagCantidad = prefix + "Cantidad";
                        let tagPrecioUnitario = prefix + "PrecioUnitario";
                        let tagDescuentoMonto = prefix + "DescuentoMonto";

                        const encabezadoElement = eFactElement.getElementsByTagName(tagEncabezado)[0];
                        if (!encabezadoElement) throw new Error("Falta el elemento Encabezado dentro de eFact");

                        const rucEmisorElement = encabezadoElement.getElementsByTagName(tagRUCEmisor)[0];
                        const rznSocElement = encabezadoElement.getElementsByTagName(tagRznSoc)[0];
                        const fchEmisElement = encabezadoElement.getElementsByTagName(tagFchEmis)[0];
                        const serieElement = encabezadoElement.getElementsByTagName(tagSerie)[0];
                        const nroElement = encabezadoElement.getElementsByTagName(tagNro)[0];

                        if (!rucEmisorElement) throw new Error("Falta el elemento RUCEmisor en Encabezado");
                        if (!rznSocElement) throw new Error("Falta el elemento RznSoc en Encabezado");
                        if (!fchEmisElement) throw new Error("Falta el elemento FchEmis en Encabezado");
                        if (!serieElement) throw new Error("Falta el elemento Serie en Encabezado");
                        if (!nroElement) throw new Error("Falta el elemento Nro en Encabezado");

                        Logger.info(`[Audit][CargarFacturasController] Found required elements in file: ${file.name}`);

                        const rucEmisor = rucEmisorElement.textContent;
                        const rznSoc = rznSocElement.textContent;
                        const fchEmis = fchEmisElement.textContent;
                        const serie = serieElement.textContent;
                        const nro = nroElement.textContent;

                        // Buscar <Detalle> dentro de <eFact>
                        const detalleElement = eFactElement.getElementsByTagName(tagDetalle)[0];
                        if (!detalleElement) throw new Error("Falta el elemento Detalle dentro de eFact");

                        const detalleItems = detalleElement.getElementsByTagName(tagItem);

                        const items = [];

                        // Obtener el proveedor por RUC una sola vez por archivo
                        const supplier = suppliers.find(s => s.rut === rucEmisor);

                        let purchasePrices = [];
                        if (supplier) {
                            // Buscar los precios de compra asociados al proveedor
                            purchasePrices = await PurchasePricesModel.findBySupplier(supplier.id);
                        }

                        for (let i = 0; i < detalleItems.length; i++) {
                            const item = detalleItems[i];
                            const codItemElement = item.getElementsByTagName(tagCod)[0];
                            const indFactElement = item.getElementsByTagName(tagIndFact)[0];
                            const nomItemElement = item.getElementsByTagName(tagNomItem)[0];
                            const cantidadElement = item.getElementsByTagName(tagCantidad)[0];
                            const precioUnitarioElement = item.getElementsByTagName(tagPrecioUnitario)[0];
                            const descuentoMontoElement = item.getElementsByTagName(tagDescuentoMonto)[0];

                            if (!indFactElement) throw new Error("Falta el elemento IndFact en un item");
                            if (!nomItemElement) throw new Error("Falta el elemento NomItem en un item");
                            if (!cantidadElement) throw new Error("Falta el elemento Cantidad en un item");
                            if (!precioUnitarioElement) throw new Error("Falta el elemento PrecioUnitario en un item");

                            
                            const indFact = indFactElement.textContent;
                            const nomItem = nomItemElement.textContent;
                            const codItem = codItemElement?.textContent || null;
                            const cantidad = parseFloat(cantidadElement.textContent);
                            const precioUnitario = parseFloat(precioUnitarioElement.textContent);
                            const descuentoMonto = parseFloat(descuentoMontoElement ? descuentoMontoElement.textContent : "0");

                            // Calcular el subtotal
                            const subtotal = cantidad * precioUnitario;

                            // Calcular el precio con descuento basado en el subtotal
                            const precioConDescuento = (subtotal - descuentoMonto) / cantidad;
                            console.log("precioUnitario", precioUnitario, "precioConDescuento", precioConDescuento)

                            const itemData = {
                                id: CargarFacturasController.simpleHash(`${nomItem}${rucEmisor}${serie}${nro}`),
                                fileName: file.name,
                                CodItem: String(codItem || CargarFacturasController.simpleHash(nomItem)),
                                IndFact: indFact === "3" ? "TB" : indFact === "2" ? "TM" : indFact === "1" ? "EX" : "OTR",
                                NomItem: nomItem,
                                Cantidad: cantidad,
                                PrecioUnitario: precioUnitario,
                                DescuentoMonto: descuentoMonto,
                                RUCEmisor: rucEmisor,
                                RznSoc: rznSoc,
                                FchEmis: fchEmis,
                                serie,
                                nro,
                                nroFactura: serie + "-" + nro,
                                precioDescuento: precioConDescuento,
                                existsInHistory: false
                            };

                            // Verificar si el ítem ya existe en el historial usando los precios de compra cargados antes
                            const existsInHistory = purchasePrices.some(price =>
                                price.supplierProductName === nomItem &&
                                price.supplierProductCode === codItem &&
                                price.unitPrice === precioUnitario
                            );

                            itemData.existsInHistory = existsInHistory;

                            items.push(itemData);
                        }

                        Logger.info(`[Audit][CargarFacturasController] Finished processing file: ${file.name}`);
                        resolve(CargarFacturasController.transformItems(items));
                    } catch (error) {
                        Logger.error(`[Audit][CargarFacturasController] Error processing file: ${file.name} - ${error.message}`);
                        reject({ file: file || null, message: error.message, stack: error.stack });
                    }
                };

                reader.onerror = (e) => {
                    Logger.error(`[Audit][CargarFacturasController] Error reading file: ${file.name} - ${e.message}`);
                    reject({ file: file || null, message: "Error al leer el archivo", stack: e.stack });
                };
                reader.readAsText(file); // Aquí file es un Blob o File
            });
        };

        Promise.allSettled(vnode.state.uploadedFiles.map(processFile))
            .then(results => {
                results.forEach(result => {
                    if (result.status === "fulfilled") {
                        Logger.info("[Audit][CargarFacturasController] File processed successfully.");
                        allItems.push(...result.value);
                    } else if (result.status === "rejected") {
                        // Loggear el error con mayor detalle
                        const errorDetails = result.reason.stack || JSON.stringify(result.reason);
                        Logger.error(`[Audit][CargarFacturasController] File processing failed. Reason: ${errorDetails}`);
                        vnode.state.errorFiles.push(result.reason);
                    }
                });

                // Filtrar los items que tienen `existsInHistory = true`
                const filteredItems = CargarFacturasController.filterAndSortItems(allItems.filter(item => {
                    if (item.existsInHistory) {
                        Logger.info(`[Audit][CargarFacturasController] Item filtered: ${item.NomItem} - ${item.CodItem} - ${item.PrecioUnitario}`);
                        return false;
                    }
                    return true;
                }));

                vnode.state.items = filteredItems;
                vnode.state.totalItems = filteredItems.length;
                vnode.state.isProcessing = false;
                vnode.state.clearFiles = true;
                vnode.state.uploadedFiles = [];
                Logger.info("[Audit][CargarFacturasController] Finished processing all files.");
                m.redraw();
            })
            .catch(error => {
                Logger.error("[Audit][CargarFacturasController] Error during file processing.", error);
                vnode.state.isProcessing = false;
                m.redraw();
            });
    },

    transformItems(items) {
        return items
            .filter(item => 
                item.IndFact !== "OTR")
            .map(item => {
                return {
                    ...item,
                    PrecioUnitario: parseFloat(item.PrecioUnitario),
                    Cantidad: parseFloat(item.Cantidad),
                    DescuentoMonto: parseFloat(item.DescuentoMonto)
                };
            });
    },

    filterAndSortItems(items) {
        const uniqueItems = {};

        items.forEach(item => {
            const key = item.CodItem || item.NomItem;
            if (!uniqueItems[key] || new Date(item.FchEmis) > new Date(uniqueItems[key].FchEmis)) {
                uniqueItems[key] = item;
            }
        });

        return Object.values(uniqueItems).sort((a, b) => new Date(b.FchEmis) - new Date(a.FchEmis));
    },

    simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convertir a 32 bits entero
        }
        return hash;
    },
    
    async getProductsOptions() {
        return await ProductsModel.getOptionsKeyValue();
    },

    async getCodigerasOptions(parentValue) {
        return await CodiguerasModel.getParentOptionsKeyValue(parentValue);
    },

    async createPurchasePrice(selectedItem) {
        try {
            // Validar la existencia del proveedor (RUCEmisor)
            const supplier = await SuppliersModel.findByRUT(selectedItem.RUCEmisor);

            if (!supplier) {
                throw new Error(`Proveedor con RUT ${selectedItem.RUCEmisor} no encontrado.`);
            }

            // Validar que se haya seleccionado un producto
            if (!selectedItem.productKey) {
                throw new Error(`No se ha seleccionado un producto para el item ${selectedItem.NomItem}.`);
            }

            // Crear nuevo precio de compra
            const purchasePriceId = await PurchasePricesModel.save(null, {
                productKey: selectedItem.productKey,
                unitPrice: parseFloat(selectedItem.PrecioUnitario),
                date: new Date(selectedItem.FchEmis),
                supplierKey: supplier.id, 
                supplierProductName: selectedItem.NomItem,
                purchasePackaging: selectedItem.purchasePackaging,
                supplierProductCode: selectedItem.CodItem,
                packagingConversion: selectedItem.packagingConversion
            });

            // Actualizar historial de precios de compra del producto
            await ProductsModel.updatePurchasePriceHistory(selectedItem.productKey, {
                purchasePriceId: purchasePriceId,
                unitPrice: parseFloat(selectedItem.PrecioUnitario),
                date: new Date(selectedItem.FchEmis),
                supplierKey: supplier.id,
                supplierProductName: selectedItem.NomItem,
                purchasePackaging: selectedItem.purchasePackaging,
                supplierProductCode: selectedItem.CodItem,
                packagingConversion: selectedItem.packagingConversion
            });

            Logger.info(`[Audit][CargarFacturasController] Purchase price created and associated successfully for product ${selectedItem.productKey}.`);
        } catch (error) {
            Logger.error(`[Audit][CargarFacturasController] Error creating purchase price: ${error.message}`);
            throw error;
        }
    },
    async updateConversionLabel(vnode) {
        const productId = vnode.state.selectedItem.productKey;
        if (productId) {
            try {
                const product = await ProductsModel.findById(productId);
                if (product && product.salesPackaging) {
                    vnode.state.conversionLabel = `Conversión de Empaque a ${product.salesPackaging}`;
                } else {
                    vnode.state.conversionLabel = "Conversión de Empaque";
                }
                m.redraw();
            } catch (error) {
                Logger.error("[Audit][PurchasePriceFormController] Error fetching sales packaging:", error);
            }
        }
    }
};

export default CargarFacturasController;
