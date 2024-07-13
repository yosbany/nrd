const GenericList = {
    view: (vnode) => {
        const { entity, items, renderItem } = vnode.attrs;
        return m('div', [
            m('h2', `Lista de ${entity}`),
            m('table', { style: { width: '100%', borderCollapse: 'collapse' } }, [
                m('thead', [
                    m('tr', renderItem.header.map(header => m('th', header)))
                ]),
                m('tbody', items.map(item => renderItem.body(item)))
            ]),
            m(m.route.Link, { href: `/${entity}/nuevo` }, `Agregar ${entity}`)
        ]);
    }
};

export default GenericList;
