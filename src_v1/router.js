import App from './components/App.js';
import EntityList from './components/EntityList.js';
import EntityForm from './components/EntityForm.js';
import AssociationManager from './components/AssociationManager.js';
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
        render: vnode => m(ProtectedRoute, { roles: ['Admin', 'User'] }, m(App, m(EntityList, vnode.attrs)))
    },
    "/:entity/new": {
        render: vnode => m(ProtectedRoute, { roles: ['Admin', 'User'] }, m(App, m(EntityForm, vnode.attrs)))
    },
    "/:entity/:id": {
        render: vnode => m(ProtectedRoute, { roles: ['Admin', 'User'] }, m(App, m(EntityForm, vnode.attrs)))
    },
    "/:entity/:id/associations/:associationProperty": {
        render: vnode => m(ProtectedRoute, { roles: ['Admin', 'User'] }, m(App, m(AssociationManager, vnode.attrs)))
    }
});
