import App from './components/App.js';
import EntityManagerView from './components/EntityManagerView.js';
import EntityFormView from './components/EntityFormView.js';
import AssociationManagerView from './components/AssociationManagerView.js';
import Login from './components/Login.js';
import Home from './components/Home.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Unauthorized from './components/Unauthorized.js';

m.route(document.body, "/login", {
    "/login": {
        render: () => m(Login)
    },
    "/home": {
        render: vnode => m(ProtectedRoute, m(App, m(Home)))
    },
    "/unauthorized": {
        render: () => m(App, m(Unauthorized))
    },
    "/:entity": {
        render: vnode => m(ProtectedRoute, { roles: ['Admin', 'User'] }, m(App, m(EntityManagerView, vnode.attrs)))
    },
    "/:entity/new": {
        render: vnode => m(ProtectedRoute, { roles: ['Admin', 'User'] }, m(App, m(EntityFormView, vnode.attrs)))
    },
    "/:entity/:id": {
        render: vnode => m(ProtectedRoute, { roles: ['Admin', 'User'] }, m(App, m(EntityFormView, vnode.attrs)))
    },
    "/:entity/:id/associations/:associationProperty": {
        render: vnode => m(ProtectedRoute, { roles: ['Admin', 'User'] }, m(App, m(AssociationManagerView, vnode.attrs)))
    }
});
