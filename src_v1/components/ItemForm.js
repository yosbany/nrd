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
        return m("form.pure-form.pure-form-aligned", {
            onsubmit: function(e) {
                e.preventDefault();
                ItemForm.saveItem();
            }
        }, [
            m("fieldset", [
                m("div.pure-control-group", [
                    m("label[for=name]", "Name"),
                    m("input#name[type=text]", {
                        oninput: function(e) {
                            ItemForm.item.name = e.target.value;
                        },
                        value: ItemForm.item.name
                    })
                ]),
                m("div.pure-controls", [
                    m("button.pure-button.pure-button-primary", "Save")
                ])
            ])
        ]);
    }
};

export default ItemForm;
