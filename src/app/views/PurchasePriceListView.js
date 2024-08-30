import PurchasePriceListController from '../controllers/PurchasePriceListController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import TextInput from '../../core/ui/Text.js';
import Button from '../../core/ui/Button.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Card from '../../core/ui/Card.js';
import Table from '../../core/ui/Table.js';
import Text from '../../core/ui/Text.js';
import Number from '../../core/ui/Number.js';
import DateInput from '../../core/ui/DatePicker.js';
import LoadingSpinner from '../views/partials/Loading.js';

const PurchasePriceListView = {
    oninit: vnode => {
        PurchasePriceListController.initialize(vnode);
    },

    view: vnode => {
        const filteredItems = PurchasePriceListController.filterItems(vnode);

        return [
            m(LoadingSpinner, { loading: vnode.state.loading }),
            m(Card, { title: "Precios de Compra", useCustomPadding: false }, [
                m(Breadcrumb, { items: [{ name: "Inicio", path: "/" }, { name: "Precios de Compra", path: "/purchase-prices" }] }),
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
                            onClick: () => m.route.set('/purchase-prices/new')
                        })
                    ])
                ]),
                m(Table, {
                    bind: filteredItems,
                    onEdit: id => PurchasePriceListController.onEdit(id),
                    onDelete: id => PurchasePriceListController.onDelete(vnode, id)
                }, [
                    m(DateInput, { label: "Fecha", value: "bind.date" }),
                    m(Text, { label: "Producto", value: "bind.product.name" }),
                    m(Text, { label: "Proveedor", value: "bind.supplier.tradeName" }),
                    m(Number, { label: "Precio Unitario", value: "bind.unitPrice", format: "currency" }),
                    m(Text, { label: "Empaque de Compra", value: "bind.purchasePackaging" }),
                ]),
                filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
            ])
        ];
    }
};

export default PurchasePriceListView;
