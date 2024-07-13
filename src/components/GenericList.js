const GenericList = {
    view: (vnode) => {
        const { entity, items, renderItem } = vnode.attrs;
        return m('div', [
            m('h2', `Lista de ${entity}`),
            m('ul', items.map(item => m('li', [
                renderItem(item),
                m('span', ' '),
                m(m.route.Link, { href: `/${entity}/editar/${item.id}` }, 'Editar'),
                m('span', ' | '),
                m(m.route.Link, { href: `/${entity}/eliminar/${item.id}` }, 'Eliminar')
            ]))),
            m(m.route.Link, { href: `/${entity}/nuevo` }, `Agregar ${entity}`)
        ]);
    }
};

export default GenericList;
