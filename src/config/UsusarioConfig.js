const usuarioRenderItem = {
    header: ['Nombre', 'Acciones'],
    body: (item, onDelete) => {
        return m('tr', [
            m('td', item.nombre),
            m('td', [
                m(m.route.Link, { href: `/usuarios/editar/${item.id}` }, 'Editar'),
                m('span', ' | '),
                m('a', {
                    href: 'javascript:void(0)',
                    onclick: () => onDelete(item.id)
                }, 'Eliminar')
            ])
        ]);
    }
};

const usuarioRenderForm = (item) => [
    m('div', { style: { marginBottom: '10px' } }, [
        m('label', { style: { display: 'inline-block', width: '100px' } }, 'Nombre:'),
        m('input[type=text]', {
            value: item.nombre || '',
            style: { width: '200px' },
            onchange: (e) => item.nombre = e.target.value
        })
    ]),
    m('div', { style: { marginTop: '20px' } }, [
        m('button[type=submit]', { style: { marginRight: '10px' } }, 'Guardar'),
        m('span', ' '),
        m('a', { href: 'javascript:void(0)', onclick: () => window.history.back() }, 'Cancelar')
    ])
];

export { usuarioRenderItem, usuarioRenderForm };
