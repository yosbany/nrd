import FirebaseModel from '../models/FirebaseModel.js';
import GenericForm from '../components/GenericForm.js';

const GenericFormView = {
    oninit: (vnode) => {
        const { entity, id } = vnode.attrs;
        vnode.state.item = {};
        if (id) {
            FirebaseModel.getById(entity, id).then(item => {
                vnode.state.item = item;
                m.redraw();
            });
        }
    },
    view: (vnode) => {
        const { entity, renderForm } = vnode.attrs;
        return m(GenericForm, {
            entity,
            item: vnode.state.item,
            renderForm,
            onSubmit: (item) => {
                FirebaseModel.saveOrUpdate(entity, item.id, item).then(() => m.route.set(`/${entity}`));
            }
        });
    }
};

export default GenericFormView;
