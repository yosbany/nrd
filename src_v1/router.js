import ItemList from './components/ItemList.js';
import ItemForm from './components/ItemForm.js';
import App from './components/App.js'

m.route(document.getElementById('app'), "/items", {
    "/items": {
        render: function() {
            return m(App, m(ItemList));
        }
    },
    "/edit/:id": {
        render: function(vnode) {
            return m(App, m(ItemForm, vnode.attrs));
        }
    },
    "/create": {
        render: function() {
            return m(App, m(ItemForm));
        }
    }
});