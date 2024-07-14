import FirebaseModel from '../models/FirebaseModel.js';
import GenericList from '../components/GenericList.js';

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
        const { entity, renderItem } = vnode.attrs;

        const handleDelete = (id) => {
            if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                FirebaseModel.delete(entity, id).then(() => {
                    // Volver a cargar los items
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
                renderItem: {
                    header: renderItem.header,
                    body: (item) => renderItem.body(item, handleDelete)
                }
            }),
            m('hr'),
            m('a', { href: m.route.prefix + '/', oncreate: m.route.Link }, 'Regresar al Inicio')
        ]);
    }
};

export default GenericListView;
