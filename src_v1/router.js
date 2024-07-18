import ItemList from './components/ItemList.js';
import ItemForm from './components/ItemForm.js';

m.route(document.getElementById('app'), "/items", {
    "/items": ItemList,
    "/edit/:id": ItemForm,
    "/create": ItemForm
});
