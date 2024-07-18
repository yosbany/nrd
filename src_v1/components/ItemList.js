import m from 'https://unpkg.com/mithril/mithril.js';
import FirebaseModel from '../models/FirebaseModel.js';

const ItemList = {
    oninit: function() {
        FirebaseModel.getAll('items').then(items => {
            ItemList.items = items;
            m.redraw();
        });
    },
    items: [],
    deleteItem: function(id) {
        FirebaseModel.delete('items', id).then(() => {
            ItemList.items = ItemList.items.filter(item => item.id !== id);
            m.redraw();
        });
    },
    view: function() {
        return m("div", [
            m("h1", "Items"),
            m("button", { onclick: () => m.route.set("/create") }, "Create New Item"),
            m("table", [
                m("thead", m("tr", [m("th", "ID"), m("th", "Name"), m("th", "Actions")])),
                m("tbody", 
                    ItemList.items.map((item) => 
                        m("tr", [
                            m("td", { "data-label": "ID" }, item.id),
                            m("td", { "data-label": "Name" }, item.name),
                            m("td", { "data-label": "Actions" }, [
                                m("button", { onclick: () => m.route.set(`/edit/${item.id}`) }, "Edit"),
                                m("button", { onclick: () => ItemList.deleteItem(item.id) }, "Delete")
                            ])
                        ])
                    )
                )
            ])
        ]);
    }
};

export default ItemList;
