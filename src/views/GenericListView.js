import FirebaseModel from '../models/FirebaseModel.js';
import GenericList from '../components/GenericList.js';
import { usuarioRenderItem } from '../config/UsusarioConfig.js';

const GenericListView = {
    oninit: (vnode) => {
        const { entity } = vnode.attrs;
        vnode.state.items = [];
        FirebaseModel.getAll(entity).then(items => {
            vnode.state.items = items || [];
            m.redraw();
        });
    },
    view: (vnode) => {
        const { entity } = vnode.attrs;

        const handleDelete = (id) => {
            if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                FirebaseModel.delete(entity, id).then(() => {
                    FirebaseModel.getAll(entity).then(items => {
                        vnode.state.items = items || [];
                        m.redraw();
                    });
                });
            }
        };

        return m('div', [
            m(GenericList, {
                entity,
                items: vnode.state.items,
                renderItem: (item) => usuarioRenderItem.body(item, handleDelete)
            }),
            m('hr'),
            m('a', { href: m.route.prefix + '/', oncreate: m.route.Link }, 'Regresar al Inicio')
        ]);
    }
};

export default GenericListView;
