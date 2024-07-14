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
    m('div.form-group', [
        m('label', { class: 'form-label' }, 'Nombre:'),
        m('input[type=text]', {
            value: item.nombre || '',
            class: 'form-input',
            onchange: (e) => item.nombre = e.target.value
        })
    ]),
    m('div.form-actions', [
        m('button[type=submit]', { class: 'btn-submit' }, 'Guardar'),
        m('span', ' '),
        m('a', { href: 'javascript:void(0)', onclick: () => window.history.back(), class: 'btn-cancel' }, 'Cancelar')
    ])
];

export { usuarioRenderItem, usuarioRenderForm };
