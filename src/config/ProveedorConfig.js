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
    m('div', { style: { marginBottom: '10px' } }, [
        m('label', { style: { display: 'inline-block', width: '100px' } }, 'Código:'),
        m('input[type=text]', {
            value: item.codigo || '',
            style: { width: '200px' },
            onchange: (e) => item.codigo = e.target.value
        })
    ]),
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
export { proveedorRenderItem, proveedorRenderForm };
