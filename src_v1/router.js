import App from './components/App.js';
import EntityList from './components/EntityList.js';
import EntityForm from './components/EntityForm.js';
import AssociationManager from './components/AssociationManager.js';

m.route(document.body, "/users", {
    "/:entity": {
        render: vnode => m(App, m(EntityList, vnode.attrs))
    },
    "/:entity/new": {
        render: vnode => m(App, m(EntityForm, vnode.attrs))
    },
    "/:entity/:id": {
        render: vnode => m(App, m(EntityForm, vnode.attrs))
    },
    "/:entity/:id/associations/:associationProperty": {
        render: vnode => m(App, m(AssociationManager, vnode.attrs))
    }
});
