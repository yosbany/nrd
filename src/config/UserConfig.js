const userRenderItem = (item) => `${item.nombre} (${item.id})`;

const userRenderForm = (item) => [
    m('label', 'Nombre:'),
    m('input[type=text]', {
        value: item.nombre || '',
        onchange: (e) => item.nombre = e.target.value
    }),
    m('br'),
    m('br'),
    m('hr'),
    m('button[type=submit]', 'Guardar')
];

export { userRenderItem, userRenderForm };
