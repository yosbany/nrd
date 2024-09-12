import ProductListController from '../controllers/ProductListController.js';
import Table from '../../core/ui/Table.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import TextInput from '../../core/ui/Text.js';
import Button from '../../core/ui/Button.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Card from '../../core/ui/Card.js';
import Text from '../../core/ui/Text.js';
import Number from '../../core/ui/Number.js';
import LoadingSpinner from '../views/partials/Loading.js';

const ProductListView = {
    oninit: ProductListController.oninit,

    view: vnode => {
        return [
            m(LoadingSpinner, { loading: vnode.state.loading }),
            m(Card, { title: "Productos", useCustomPadding: true }, [
                m(Breadcrumb, { items: [{ name: "Inicio", path: "/" }, { name: "Productos", path: "/products" }] }),
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
                            onClick: () => m.route.set('/products/new')
                        })
                    ])
                ]),
                m(Table, {
                    bind: ProductListController.filterItems(vnode),
                    onEdit: id => ProductListController.onEdit(id),
                    onDelete: id => ProductListController.onDelete(vnode, id)
                }, [
                    m(Text, { label: "SKU", value: "bind.sku" }),
                    m(Text, { label: "Nombre", value: "bind.name" }),
                    m(Text, { label: "Stock Deseado", value: "bind.desiredStockPackaging" }),
                    m(Text, { label: "Sector", value: "bind.sector" }),
                    m(Text, { label: "Costo Unitario", value: "bind.unitSalesCost" }),
                    m(Text, { label: "Proveedor", value: "bind.preferredSupplier.tradeName" }),
                ]),
                !vnode.state.loading && vnode.state.products.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
            ])
        ];
    }
};

export default ProductListView;
