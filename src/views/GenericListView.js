// FirebaseModel.js import
import FirebaseModel from '../models/FirebaseModel.js';
import GenericList from '../components/GenericList.js';

const GenericListView = {
    oninit: (vnode) => {
        const { entity } = vnode.attrs;
        vnode.state.items = [];
        vnode.state.loadItems = () => {
            FirebaseModel.getAll(entity).then(items => {
                vnode.state.items = items || [];
                m.redraw();
            });
        };
        vnode.state.loadItems();
    },
    view: (vnode) => {
        const { entity, renderItem } = vnode.attrs;
        return m('div', [
            m(GenericList, {
                entity,
                items: vnode.state.items,
                renderItem,
                onDelete: vnode.state.loadItems
            }),
            m('hr'),
            m('a', { href: m.route.prefix + '/', oncreate: m.route.Link }, 'Regresar al Inicio')
        ]);
    }
};

export default GenericListView;
