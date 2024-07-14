import FirebaseModel from '../models/FirebaseModel.js';

const GenericFormView = {
    oninit: (vnode) => {
        const { entity, id } = vnode.attrs;
        vnode.state.item = id ? null : {};
        if (id) {
            FirebaseModel.getById(entity, id).then(item => {
                vnode.state.item = item || {};
                m.redraw();
            });
        }
    },
    view: (vnode) => {
        const { entity, renderForm } = vnode.attrs;
        const { item } = vnode.state;
        
        if (!item) {
            return m('div', 'Cargando...');
        }
        
        return m('form', {
            onsubmit: (e) => {
                e.preventDefault();
                FirebaseModel.saveOrUpdate(entity, vnode.attrs.id, vnode.state.item).then(() => {
                    m.route.set(`/${entity}`);
                });
            }
        }, renderForm(vnode.state));
    }
};

export default GenericFormView;
