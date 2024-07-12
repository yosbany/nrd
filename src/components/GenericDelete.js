const GenericDelete = {
    view: (vnode) => {
        const { entity, item } = vnode.attrs;
        return m('div', [
            m('p', `¿Estás seguro de que deseas eliminar este ${entity}?`),
            m('br'),
            m('br'),
            m('hr'),
            m('button', {
                onclick: () => vnode.attrs.onDelete(item.id)
            }, 'Eliminar'),
            m('span', ' '),
            m('a', { href: 'javascript:void(0)', onclick: () => window.history.back() }, 'Cancelar')
        ]);
    }
};

export default GenericDelete;
