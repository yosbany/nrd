import OutputText from '../components/base/OutputText.js';
import Link from '../components/base/Link.js';
import Button from '../components/base/Button.js';
import InputText from '../components/base/InputText.js';
import FirebaseModel from '../models/FirebaseModel.js';

const proveedorRenderItem = {
    header: ['Código', 'Nombre', 'Acciones'],
    body: (item) => {
        return [
            m(OutputText, { text: item.codigo }),
            m(OutputText, { text: item.nombre }),
            m('div', [
                m(Link, { href: `/proveedores/editar/${item.id}` }, 'Editar'),
                m('span', ' | '),
                m(Link, {
                    href: 'javascript:void(0)',
                    onclick: () => {
                        if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
                            FirebaseModel.delete('proveedores', item.id).then(() => {
                                m.route.set('/proveedores');
                            });
                        }
                    }
                }, 'Eliminar')
            ])
        ];
    }
};

const proveedorRenderForm = (item) => [
    m('div.form-group', [
        m('label', { class: 'form-label' }, 'Código:'),
        m(InputText, {
            value: item.codigo || '',
            class: 'form-input',
            onchange: (e) => item.codigo = e.target.value
        })
    ]),
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

export { proveedorRenderItem, proveedorRenderForm };
