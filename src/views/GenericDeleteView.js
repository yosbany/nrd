import FirebaseModel from '../models/FirebaseModel.js';
import GenericDelete from '../components/GenericDelete.js';

const GenericDeleteView = {
    oninit: (vnode) => {
        const { entity, id } = vnode.attrs;
        vnode.state.item = {};
        FirebaseModel.getById(entity, id).then(item => {
            vnode.state.item = item;
            m.redraw();
        });
    },
    view: (vnode) => {
        const { entity } = vnode.attrs;
        return m(GenericDelete, {
            entity,
            item: vnode.state.item,
            onDelete: (id) => {
                FirebaseModel.delete(entity, id).then(() => m.route.set(`/${entity}`));
            }
        });
    }
};

export default GenericDeleteView;
