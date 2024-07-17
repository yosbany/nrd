import ItemList from './src_v1/components/ItemList.js';
import ItemForm from './src_v1/components/ItemForm.js';

m.route(document.getElementById('app'), "/items", {
    "/items": ItemList,
    "/edit/:id": ItemForm,
    "/create": ItemForm
});
