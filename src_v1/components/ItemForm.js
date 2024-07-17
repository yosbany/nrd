import FirebaseModel from '../models/FirebaseModel.js';
const ItemForm = {
    oninit: function(vnode) {
        if (vnode.attrs.id) {
            FirebaseModel.getById('items', vnode.attrs.id).then(item => {
                ItemForm.item = item;
                m.redraw();
            });
        } else {
            ItemForm.item = { name: '' };
        }
    },
    item: {},
    saveItem: function() {
        const data = { name: ItemForm.item.name };
        FirebaseModel.saveOrUpdate('items', ItemForm.item.id, data).then(() => {
            m.route.set("/items");
        });
    },
    view: function() {
        return m("form", {
            onsubmit: function(e) {
                e.preventDefault();
                ItemForm.saveItem();
            }
        }, [
            m("div", [
                m("label", "Name"),
                m("input[type=text]", {
                    oninput: function(e) {
                        ItemForm.item.name = e.target.value;
                    },
                    value: ItemForm.item.name
                })
            ]),
            m("button[type=submit]", "Save")
        ]);
    }
};

export default ItemForm;
