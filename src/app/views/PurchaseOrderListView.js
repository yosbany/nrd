import PurchaseOrderListController from '../controllers/PurchaseOrderListController.js';
import Table from '../../core/ui/Table.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import TextInput from '../../core/ui/Text.js';
import Button from '../../core/ui/Button.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Card from '../../core/ui/Card.js';
import Text from '../../core/ui/Text.js';
import Number from '../../core/ui/Number.js';
import DateInput from '../../core/ui/DatePicker.js';
import Modal from '../../core/ui/Modal.js';
import LoadingSpinner from '../views/partials/Loading.js';
import Checkbox from '../../core/ui/Checkbox.js';

const PurchaseOrderListView = {
    oninit: vnode => {
        PurchaseOrderListController.oninit(vnode);
        vnode.state.showSupplierNames = false; // Estado inicial para mostrar nombres de productos del proveedor
    },

    view: vnode => {
        const filteredItems = PurchaseOrderListController.filterItems(vnode);

        return [
            m(LoadingSpinner, { loading: vnode.state.loading }),
            m(Card, { title: "Órdenes de Compra", useCustomPadding: false }, [
                m(Breadcrumb, { items: [{ name: "Inicio", path: "/" }, { name: "Órdenes de Compra", path: "/purchase-orders" }] }),
                m(Fila, { gap: 'medium' }, [
                    m(Column, { width: 'expand' }, [
                        m(TextInput, {
                            value: vnode.state.searchText,
                            onInput: value => vnode.state.searchText = value,
                            placeholder: "Buscar...",
                            showLabel: false
                        })
                    ]),
                    m(Column, { width: 'auto' }, [
                        m(Button, {
                            type: "primary",
                            label: "Nuevo",
                            onClick: () => m.route.set('/purchase-orders/new')
                        })
                    ])
                ]),
                m(Table, {
                    bind: filteredItems,
                    onEdit: id => PurchaseOrderListController.onEdit(id),
                    onDelete: id => PurchaseOrderListController.onDelete(vnode, id),
                    additionalActions: [
                        {
                            icon: 'check',
                            title: 'Completar Orden',
                            style: { backgroundColor: 'lightgreen' },
                            onClick: order => PurchaseOrderListController.onCompleteOrder(vnode, order)
                        }
                    ]
                }, [
                    m(DateInput, { label: "Fecha de Orden", value: "bind.orderDate" }),
                    m(Text, { label: "Proveedor", value: "bind.supplier.tradeName" }),
                    m(Number, { label: "Productos", value: "bind.cantidadProductos", format: "integer" }),
                    m(Text, { label: "Estado", value: "bind.status" }),
                    m(Number, { label: "Importe", value: "bind.totalAmount", format: "currency" }),
                ]),
                vnode.state.showModal && m(Modal, {
                    show: vnode.state.showModal,
                    title: "Completar Orden",
                    onClose: () => vnode.state.showModal = false,
                    content: vnode.state.selectedOrder 
                        ? [
                            m(Checkbox, {
                                value: vnode.state.showSupplierNames ? ["Nombres del Proveedor"] : [],
                                onInput: async value => {
                                    vnode.state.showSupplierNames = value.includes("Nombres del Proveedor");
                                    vnode.state.orderText = await PurchaseOrderListController.generateOrderText(
                                        vnode.state.selectedOrder, 
                                        vnode.state.showSupplierNames // Pasa el estado actual del checkbox
                                    );
                                    m.redraw();
                                },
                                showLabel: false,
                                options: ["Nombres del Proveedor"]
                            }),
                            // Textarea para mostrar la lista de productos
                            m("textarea.uk-textarea", {
                                id: "order-textarea",
                                rows: 10,
                                readonly: true,
                                value: vnode.state.orderText || "Generando el texto de la orden..."
                            })
                        ]
                        : "No hay datos disponibles para la orden seleccionada."
                }, [
                    m("div.uk-margin-small-bottom", [
                        m("div", { style: { textAlign: "right", fontSize: "0.8em" } },
                            vnode.state.selectedOrder?.supplier?.phone || "Número no disponible"
                        ),
                        m("div.uk-flex.uk-flex-right", [
                            m(Button, {
                                label: "Imprimir",
                                onClick: () => PurchaseOrderListController.printOrder(vnode, vnode.state.selectedOrder),
                                style: { marginLeft: "10px" },
                            }),
                            m(Button, {
                                label: "Enviar WhatsApp",
                                type: "primary",
                                style: { marginLeft: "10px" },
                                onClick: () => PurchaseOrderListController.sendOrder(vnode, vnode.state.selectedOrder),
                                disabled: !vnode.state.selectedOrder?.supplier?.phone // Deshabilitar si no hay número disponible
                            })
                        ])
                    ])
                ])
            ]),
            !vnode.state.loading && filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
        ];
    }
};

export default PurchaseOrderListView;
