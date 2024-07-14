const proveedorRenderItem = {
    header: ['Código', 'Nombre', 'Acciones'],
    body: (item) => {
        return m('tr', [
            m('td', item.codigo),
            m('td', item.nombre),
            m('td', [
                m(m.route.Link, { href: `/proveedores/editar/${item.id}` }, 'Editar'),
                m('span', ' | '),
                m('a', {
                    href: 'javascript:void(0)',
                    onclick: () => {
                        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                            FirebaseModel.delete('proveedores', item.id).then(() => {
                                m.route.set('/proveedores');
                            });
                        }
                    }
                }, 'Eliminar')
            ])
        ]);
    }
};

const proveedorRenderForm = (item) => [
    m('div.form-group', [
        m('label', { class: 'form-label' }, 'Código:'),
        m('input[type=text]', {
            value: item.codigo || '',
            class: 'form-input',
            onchange: (e) => item.codigo = e.target.value
        })
    ]),
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

export { proveedorRenderItem, proveedorRenderForm };
