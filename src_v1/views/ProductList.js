import FirebaseModel from '../models/FirebaseModel.js';
import Table from '../components/base/Table.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import TextInput from '../components/base/Text.js';
import Button from '../components/base/Button.js';
import Fila from '../components/base/Fila.js';
import Column from '../components/base/Column.js';
import Card from '../components/base/Card.js';
import Text from '../components/base/Text.js';
import Number from '../components/base/Number.js';
import LoadingSpinner from '../components/LoadingSpinner.js'; 
import { encodeId } from '../utils.js';

const ProductList = {
    oninit: vnode => {
        vnode.state.searchText = '';
        vnode.state.products = [];
        vnode.state.loading = true;

        ProductList.loadProducts(vnode);
    },

    loadProducts: vnode => {
        FirebaseModel.getAll('Products')
            .then(data => {
                vnode.state.products = data;
                vnode.state.loading = false;
                m.redraw();
            })
            .catch(error => {
                console.error("[Audit][ProductList] Error loading products:", error);
                vnode.state.loading = false;
                m.redraw();
            });
    },

    filterItems: vnode => {
        if (!vnode.state.searchText) return vnode.state.products;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.products.filter(product =>
            Object.values(product).some(value =>
                value && value.toString().toLowerCase().includes(searchText)
            )
        );
    },

    onEdit: id => {
        m.route.set(`/products/${encodeId(id)}`);
    },

    onDelete: (vnode, id) => {
        FirebaseModel.delete('Products', id)
            .then(() => {
                ProductList.loadProducts(vnode);
            })
            .catch(error => console.error("[Audit][ProductList] Error deleting product:", error));
    },

    view: vnode => {
        return [
            m(LoadingSpinner, { loading: vnode.state.loading }),
            m(Card, { title: "Productos", useCustomPadding: false }, [
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
                    bind: ProductList.filterItems(vnode),
                    onEdit: id => ProductList.onEdit(id),
                    onDelete: id => ProductList.onDelete(vnode, id)
                }, [
                    m(Text, { label: "SKU", value: "bind.sku" }),
                    m(Text, { label: "Nombre", value: "bind.name" }),
                    m(Number, { label: "Stock Deseado", value: "bind.desiredStock", format: "decimal" }),
                    m(Number, { label: "Stock Mínimo", value: "bind.minimumStock", format: "decimal" }),
                    m(Text, { label: "Proveedor", value: "bind.preferredSupplierKey.businessName" }),
                    m(Number, { label: "Último Precio", value: "bind.lastPurchasePrice", format: "currency" })
                ]),
                !vnode.state.loading && vnode.state.products.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
            ])
        ];
    }
};

export default ProductList;
