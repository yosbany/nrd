import HomeView from '../views/HomeView.js';
import MainLayout from '../views/layouts/MainLayout.js';
import ProductListView from '../views/ProductListView.js';
import PurchaseOrderListView from '../views/PurchaseOrderListView.js';
import PurchasePriceListView from '../views/PurchasePriceListView.js';
import SupplierListView from '../views/SupplierListView.js';
import UserListView from '../views/UserListView.js';
import UserFormView from '../views/UserFormView.js';
import ProductFormView from '../views/ProductFormView.js';
import SupplierFormView from '../views/SupplierFormView.js';
import PurchasePriceFormView from '../views/PurchasePriceFormView.js';
import PurchaseOrderFormView from '../views/PurchaseOrderFormView.js';

const RouteAppConfig = {
    "/": {
        render: vnode => m(MainLayout, m(HomeView, vnode.attrs))
    },
    "/home": {
        render: vnode => m(MainLayout, m(HomeView, vnode.attrs))
    },
    "/users": {
        render: vnode => m(MainLayout, m(UserListView, vnode.attrs))
    },
    "/users/new": {
        render: vnode => m(MainLayout, m(UserFormView, vnode.attrs))
    },
    "/users/:id": {
        render: vnode => m(MainLayout, m(UserFormView, vnode.attrs))
    },
    "/products": {
        render: vnode => m(MainLayout, m(ProductListView, vnode.attrs))
    },
    "/products/new": {
        render: vnode => m(MainLayout, m(ProductFormView, vnode.attrs))
    },
    "/products/:id": {
        render: vnode => m(MainLayout, m(ProductFormView, vnode.attrs))
    },
    "/suppliers": {
        render: vnode => m(MainLayout, m(SupplierListView, vnode.attrs))
    },
    "/suppliers/new": {
        render: vnode => m(MainLayout, m(SupplierFormView, vnode.attrs))
    },
    "/suppliers/:id": {
        render: vnode => m(MainLayout, m(SupplierFormView, vnode.attrs))
    },
    "/purchase-prices": {
        render: vnode => m(MainLayout, m(PurchasePriceListView, vnode.attrs))
    },
    "/purchase-prices/new": {
        render: vnode => m(MainLayout, m(PurchasePriceFormView, vnode.attrs))
    },
    "/purchase-prices/:id": {
        render: vnode => m(MainLayout, m(PurchasePriceFormView, vnode.attrs))
    },
    "/purchase-orders": {
        render: vnode => m(MainLayout, m(PurchaseOrderListView, vnode.attrs))
    },
    "/purchase-orders/new": {
        render: vnode => m(MainLayout, m(PurchaseOrderFormView, vnode.attrs))
    },
    "/purchase-orders/:id": {
        render: vnode => m(MainLayout, m(PurchaseOrderFormView, vnode.attrs))
    }
};

export default RouteAppConfig;
