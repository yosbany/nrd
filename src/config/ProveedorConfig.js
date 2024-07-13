const proveedorRenderItem = (item) => `${item.codigo} - ${item.nombre}`;

const proveedorRenderForm = (item) => [
    m('label', 'Código:'),
    m('input[type=text]', {
        value: item.codigo || '',
        onchange: (e) => item.codigo = e.target.value
    }),
    m('br'),
    m('label', 'Nombre:'),
    m('input[type=text]', {
        value: item.nombre || '',
        onchange: (e) => item.nombre = e.target.value
    }),
    m('br'),
    m('br'),
    m('hr'),
    m('button[type=submit]', 'Guardar'),
    m('span', ' '),
    m('a', { href: 'javascript:void(0)', onclick: () => window.history.back() }, 'Cancelar')
];

export { proveedorRenderItem, proveedorRenderForm };
