import FirebaseModel from '../models/FirebaseModel.js';

const GenericList = {
    view: (vnode) => {
        const { entity, items, renderItem, onDelete } = vnode.attrs;
        return m('div', [
            m('h2', `Lista de ${entity}`),
            m('ul', items.map(item => m('li', [
                renderItem(item),
                m('span', ' '),
                m(m.route.Link, { href: `/${entity}/editar/${item.id}` }, 'Editar'),
                m('span', ' | '),
                m('a', {
                    href: 'javascript:void(0)',
                    onclick: () => {
                        if (confirm(`¿Estás seguro de que deseas eliminar este ${entity}?`)) {
                            FirebaseModel.delete(entity, item.id).then(() => {
                                if (typeof onDelete === 'function') {
                                    onDelete();
                                }
                            });
                        }
                    }
                }, 'Eliminar')
            ]))),
            m(m.route.Link, { href: `/${entity}/nuevo` }, `Agregar ${entity}`)
        ]);
    }
};

export default GenericList;
