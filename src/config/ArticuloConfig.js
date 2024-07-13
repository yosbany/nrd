const articuloRenderItem = (item) => `${item.codigo} - ${item.nombre}`;

const articuloRenderForm = (item) => [
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
    m('div', { style: { marginBottom: '10px' } }, [
        m('label', { style: { display: 'inline-block', width: '100px' } }, 'Stock Deseado:'),
        m('input[type=text]', {
            value: item.stock_deseado || '',
            style: { width: '200px' },
            onchange: (e) => item.stock_deseado = e.target.value
        })
    ]),
    m('div', { style: { marginBottom: '10px' } }, [
        m('label', { style: { display: 'inline-block', width: '100px' } }, 'Proveedores:'),
        m(m.route.Link, { href: `proveedores-x-articulo/${item.id}` }, 'Ver Proveedores'),
    ]),
    m('div', { style: { marginTop: '20px' } }, [
        m('button[type=submit]', { style: { marginRight: '10px' } }, 'Guardar'),
        m('a', { href: 'javascript:void(0)', onclick: () => window.history.back() }, 'Cancelar')
    ])
];
export { articuloRenderItem, articuloRenderForm };
