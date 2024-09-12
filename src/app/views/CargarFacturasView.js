import CargarFacturasController from '../controllers/CargarFacturasController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Card from '../../core/ui/Card.js';
import File from '../../core/ui/File.js';
import Table from '../../core/ui/Table.js';
import Text from '../../core/ui/Text.js';
import Number from '../../core/ui/Number.js';
import DatePicker from '../../core/ui/DatePicker.js';
import Button from '../../core/ui/Button.js';
import Modal from '../../core/ui/Modal.js';
import FilterSelect from '../../core/ui/FilterSelect.js';
import Link from '../../core/ui/Link.js';
import Logger from '../utils/Logger.js';

const CargarFacturasView = {
    oninit: vnode => {
        CargarFacturasController.oninit(vnode);
        vnode.state.showModal = false;
        vnode.state.selectedItem = null;  // Inicialmente null
        vnode.state.searchText = ""; // Estado para el texto de búsqueda
        vnode.state.isProcessed = false; // Estado para saber si se procesaron los archivos
        vnode.state.uploadedFiles = [];
    },

    openModal: (vnode, item) => {
        if (item) {
            vnode.state.selectedItem = item;
            vnode.state.selectedItem.purchasePackaging = "UN";
            vnode.state.selectedItem.packagingConversion = 1;
            vnode.state.showModal = true;
        } else {
            Logger.warn("[Audit][CargarFacturasView] Intento de abrir el modal sin un ítem válido.");
        }
    },

    closeModal: vnode => {
        vnode.state.showModal = false;
        vnode.state.selectedItem = null; 
    },

    // Función para filtrar las facturas según el texto de búsqueda
    filterItems: vnode => {
        const searchText = vnode.state.searchText.toLowerCase();
        if (!searchText) {
            return vnode.state.items;
        }
        return vnode.state.items.filter(item => {
            // Filtrar por campos relevantes como RUC Emisor, Razón Social o Nombre del Item
            return (
                item.RUCEmisor.toLowerCase().includes(searchText) ||
                item.RznSoc.toLowerCase().includes(searchText) ||
                item.NomItem.toLowerCase().includes(searchText)
            );
        });
    },

    view: vnode => {
        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Cargar Facturas", path: "/cargarfacturas" }
        ];

        return m(Card, { title: "Cargar Facturas", useCustomPadding: false }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    // Mostrar el selector de archivo siempre
                    m(File, {
                        onInput: file => {
                            if (file && file.name) {
                                if (!vnode.state.uploadedFiles) {
                                    vnode.state.uploadedFiles = [];
                                }
                                vnode.state.uploadedFiles.push(file);
                                Logger.info(`[Audit][CargarFacturasView] Archivo cargado: ${file.name}`);
                            } else {
                                Logger.warn("[Audit][CargarFacturasView] No se pudo cargar el archivo: Archivo indefinido.");
                            }
                        },
                        onRemove: file => {
                            vnode.state.uploadedFiles = vnode.state.uploadedFiles.filter(f => f.name !== file.name);
                            Logger.info(`[Audit][CargarFacturasView] Archivo eliminado: ${file.name}`);
                        },
                        required: true,
                        showLabel: false,
                        clearFiles: vnode.state.clearFiles
                    }),

                    // Mostrar el botón de procesar archivos solo si no se ha procesado nada
                    !vnode.state.isProcessed && vnode.state.uploadedFiles.length > 0 && m("div.uk-margin-small-top", [
                        m(Button, {
                            type: 'primary',
                            label: 'Procesar Archivos',
                            documentation: 'Procesa los archivos cargados',
                            onclick: () => {
                                if (vnode.state.uploadedFiles && vnode.state.uploadedFiles.length > 0) {
                                    CargarFacturasController.procesarArchivos(vnode);
                                    vnode.state.isProcessed = true; // Actualizamos el estado
                                } else {
                                    Logger.warn("[Audit][CargarFacturasView] No hay archivos para procesar.");
                                }
                            },
                            style: { width: '100%' }
                        })
                    ])
                ])
            ]),

            // Mostrar la tabla y el campo de búsqueda solo si ya se procesaron los archivos
            vnode.state.isProcessed && [
                m(Fila, { gap: 'medium' }, [
                    m(Column, { width: '1-1' }, [
                        m(Text, {
                            value: vnode.state.searchText,
                            onInput: value => vnode.state.searchText = value,
                            placeholder: "Buscar por RUC, Razón Social o Nombre del producto...",
                            showLabel: false
                        })
                    ])
                ]),

                vnode.state.isProcessing && m("div.uk-margin-top", "Procesando archivos..."),
                vnode.state.items && vnode.state.items.length > 0 && m("div.uk-margin-top", [
                    // Usar la función filterItems para mostrar los ítems filtrados
                    m(Table, {
                        bind: CargarFacturasView.filterItems(vnode),
                    }, [
                        m(DatePicker, { label: "Fecha de Emisión", value: "bind.FchEmis" }),
                        m(Text, { label: "RUC Emisor", value: "bind.RUCEmisor" }),
                        m(Text, { label: "Razón Social", value: "bind.RznSoc" }),
                        m(Text, { label: "IVA", value: "bind.IndFact" }),
                        m(Text, { label: "Factura", value: "bind.nroFactura" }),
                        m(Text, { label: "Código", value: "bind.CodItem" }),
                        m(Link, {
                            label: "Nombre",
                            textLink: "bind.NomItem",
                            id: "bind.id",
                            onClick: (id) => {
                                const selectedItem = vnode.state.items.find(i => i.id === id);
                                CargarFacturasView.openModal(vnode, selectedItem);
                            }
                        }),
                        m(Number, { label: "Precio Sin Descuento", value: "bind.PrecioUnitario" }),
                        m(Number, { label: "Precio Con Descuento", value: "bind.precioDescuento" }),
                    ])
                ])
            ],

            vnode.state.showModal && vnode.state.selectedItem && m(Modal, {
                show: vnode.state.showModal,
                onClose: () => CargarFacturasView.closeModal(vnode),
                title: "Detalles de Factura",
                content: m("div", [
                    m("p", `RUC: ${vnode.state.selectedItem.RUCEmisor}`),
                    m("p", `Razón Social: ${vnode.state.selectedItem.RznSoc}`),
                    m("p", `Nombre: ${vnode.state.selectedItem.NomItem}`),
                    m(FilterSelect, {
                        label: "Producto",
                        value: vnode.state.selectedItem.productKey || "",
                        options: async () => await CargarFacturasController.getProductsOptions(),
                        onChange: async value => {
                            vnode.state.selectedItem.productKey = value;
                            await CargarFacturasController.updateConversionLabel(vnode);
                        },
                        placeholder: "Buscar productos..."
                    }),
                    m(FilterSelect, {
                        label: "Empaque de Compra",
                        value: vnode.state.selectedItem.purchasePackaging || "UN",
                        options: async () => await CargarFacturasController.getCodigerasOptions("Unidades de Medidas"),
                        onChange: value => vnode.state.selectedItem.purchasePackaging = value,
                        required: true,
                        placeholder: "Seleccionar empaque..."
                    }),
                    m(Number, {
                        label: vnode.state.conversionLabel || "Conversión de Empaque",
                        value: vnode.state.selectedItem.packagingConversion || 1,
                        onInput: value => vnode.state.selectedItem.packagingConversion = parseFloat(value),
                        required: true,
                        min: 0.001
                    }),
                    m(Button, {
                        type: 'primary',
                        label: 'Asociar Producto',
                        onclick: async () => {
                            await CargarFacturasController.createPurchasePrice(vnode.state.selectedItem);
                             // Eliminar solo el ítem procesado de la lista
                            vnode.state.items = vnode.state.items.filter(item => item.id !== vnode.state.selectedItem.id);
        
                            CargarFacturasView.closeModal(vnode);
                        }
                    })
                ])
            })
        ]);
    }
};

export default CargarFacturasView;
