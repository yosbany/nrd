import App from './components/App.js';
import UserList from './views/UserList.js';
import ProductList from './views/ProductList.js';
import SupplierList from './views/SupplierList.js';
import PurchasePriceList from './views/PurchasePriceList.js';
import UserFormView from './views/UserFormView.js';
import ProductFormView from './views/ProductFormView.js';
import SupplierFormView from './views/SupplierFormView.js';
import PurchasePriceFormView from './views/PurchasePriceFormView.js';
import LoginView from './views/LoginView.js'
import HomeView from './views/HomeView.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Unauthorized from './components/Unauthorized.js';
import PurchaseOrderFormView from './views/PurchaseOrderFormView.js';
import PurchaseOrderList from './views/PurchaseOrderList.js';

m.route(document.body, "/login", {
    "/login": {
        render: () => m(LoginView)
    },
    "/unauthorized": {
        render: () => m(Unauthorized)
    },
    "/home": {
        render: () => m(ProtectedRoute, m(App, m(HomeView)))
    },
    "/users": {
        render: vnode => m(ProtectedRoute, m(App, m(UserList, vnode.attrs)))
    },
    "/users/new": {
        render: vnode => m(ProtectedRoute, m(App, m(UserFormView, vnode.attrs)))
    },
    "/users/:id": {
        render: vnode => m(ProtectedRoute, m(App, m(UserFormView, vnode.attrs)))
    },
    "/products": {
        render: vnode => m(ProtectedRoute, m(App, m(ProductList, vnode.attrs)))
    },
    "/products/new": {
        render: vnode => m(ProtectedRoute, m(App, m(ProductFormView, vnode.attrs)))
    },
    "/products/:id": {
        render: vnode => m(ProtectedRoute, m(App, m(ProductFormView, vnode.attrs)))
    },
    "/suppliers": {
        render: vnode => m(ProtectedRoute, m(App, m(SupplierList, vnode.attrs)))
    },
    "/suppliers/new": {
        render: vnode => m(ProtectedRoute, m(App, m(SupplierFormView, vnode.attrs)))
    },
    "/suppliers/:id": {
        render: vnode => m(ProtectedRoute, m(App, m(SupplierFormView, vnode.attrs)))
    },
    "/purchase-prices": {
        render: vnode => m(ProtectedRoute, m(App, m(PurchasePriceList, vnode.attrs)))
    },
    "/purchase-prices/new": {
        render: vnode => m(ProtectedRoute, m(App, m(PurchasePriceFormView, vnode.attrs)))
    },
    "/purchase-prices/:id": {
        render: vnode => m(ProtectedRoute, m(App, m(PurchasePriceFormView, vnode.attrs)))
    },
    "/purchase-orders": {
        render: vnode => m(ProtectedRoute, m(App, m(PurchaseOrderList, vnode.attrs)))
    },
    "/purchase-ordens/new": {
        render: vnode => m(ProtectedRoute, m(App, m(PurchaseOrderFormView, vnode.attrs)))
    },
    "/purchase-ordens/:id": {
        render: vnode => m(ProtectedRoute, m(App, m(PurchaseOrderFormView, vnode.attrs)))
    }
});
