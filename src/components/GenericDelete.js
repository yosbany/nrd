const GenericDelete = {
    view: (vnode) => {
        const { entity, item } = vnode.attrs;
        return m('div', [
            m('p', `¿Estás seguro de que deseas eliminar este ${entity}?`),
            m('button', {
                onclick: () => vnode.attrs.onDelete(item.id)
            }, 'Eliminar'),
            m(m.route.Link, { href: `/${entity}` }, 'Cancelar')
        ]);
    }
};

export default GenericDelete;
