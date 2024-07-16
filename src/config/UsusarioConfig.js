import OutputText from '../components/base/OutputText.js';
import Link from '../components/base/Link.js';
import Button from '../components/base/Button.js';
import InputText from '../components/base/InputText.js';

const usuarioRenderItem = {
    header: ['Nombre', 'Acciones'],
    body: (item, onDelete) => {
        return [
            m(OutputText, { text: item.nombre }),
            m('div', [
                m(Link, { href: `/usuarios/editar/${item.id}` }, 'Editar'),
                m('span', ' | '),
                m(Link, {
                    href: 'javascript:void(0)',
                    onclick: () => onDelete(item.id)
                }, 'Eliminar')
            ])
        ];
    }
};

const usuarioRenderForm = (item) => [
    m('div.form-group', [
        m('label', { class: 'form-label' }, 'Nombre:'),
        m(InputText, {
            value: item.nombre || '',
            class: 'form-input',
            onchange: (e) => item.nombre = e.target.value
        })
    ]),
    m('div.form-actions', [
        m(Button, { type: 'submit', class: 'btn-submit', label: 'Guardar' }),
        m('span', ' '),
        m(Link, { href: 'javascript:void(0)', onclick: () => window.history.back(), class: 'btn-cancel' }, 'Cancelar')
    ])
];

export { usuarioRenderItem, usuarioRenderForm };
