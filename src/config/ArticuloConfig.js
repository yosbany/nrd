import { Link, OutputText, Button, InputText } from '../components/base';

const articuloRenderItem = {
    header: ['Código', 'Nombre', 'Acciones'],
    body: (item, onDelete) => [
        m(OutputText, { text: item.codigo }),
        m(OutputText, { text: item.nombre }),
        m('td', [
            m(Link, { href: `/articulos/editar/${item.id}`, label: 'Editar' }),
            m('span', ' | '),
            m(Button, { onclick: () => onDelete(item.id), label: 'Eliminar' })
        ])
    ]
};

const articuloRenderForm = (item, onSave, onBack) => [
    m('div.form-group', [
        m('label', { text: 'Código:' }),
        m(InputText, {
            value: item.codigo || '',
            onchange: (e) => item.codigo = e.target.value
        })
    ]),
    m('div.form-group', [
        m('label', { text: 'Nombre:' }),
        m(InputText, {
            value: item.nombre || '',
            onchange: (e) => item.nombre = e.target.value
        })
    ]),
    m('div.form-group', [
        m('label', { text: 'Stock Deseado:' }),
        m(InputText, {
            value: item.stock_deseado || '',
            onchange: (e) => item.stock_deseado = e.target.value
        })
    ]),
    m('div.form-group', [
        m('label', { text: 'Último Precio:' }),
        m(InputText, {
            value: item.ultimo_precio || '',
            onchange: (e) => item.ultimo_precio = e.target.value
        })
    ]),
    item.id ? m('div.form-group', [
        m('label', { text: 'Proveedores:' }),
        m(Link, { href: `/proveedores-articulo/${item.id}`, label: 'Ver Proveedores' })
    ]) : null,
    m('div.form-actions', [
        m(Button, { onclick: onSave, label: 'Guardar' }),
        m('span', ' '),
        m(Button, { onclick: onBack, label: 'Cancelar' })
    ])
];

export { articuloRenderItem, articuloRenderForm };
