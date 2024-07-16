import FirebaseModel from '../models/FirebaseModel.js';
import OutputText from '../components/base/OutputText.js';
import Link from '../components/base/Link.js';
import Button from '../components/base/Button.js';
import InputText from '../components/base/InputText.js';
import Select from '../components/base/Select.js';

const ordenRenderItem = {
    header: ['Fecha', 'Proveedor', 'Importe', 'Estado', 'Acciones'],
    body: (item, onDelete) => {
        return [
            m(OutputText, { text: item.fecha }),
            m(OutputText, { text: item.proveedor }),
            m(OutputText, { text: item.importe }),
            m(OutputText, { text: item.estado }),
            m('div', [
                m(Link, { href: `/ordenes/editar/${item.id}` }, 'Editar'),
                m('span', ' | '),
                m(Link, {
                    href: 'javascript:void(0)',
                    onclick: () => onDelete(item.id)
                }, 'Eliminar')
            ])
        ];
    }
};

const ordenRenderForm = {
    oninit: (vnode) => {
        FirebaseModel.getAll('proveedores').then(proveedores => {
            vnode.state.todosProveedores = proveedores || [];
            m.redraw();
        });
    },
    view: (vnode) => [
        m('div.form-group', [
            m('label', { class: 'form-label' }, 'Fecha:'),
            m(InputText, {
                value: vnode.attrs.item.fecha || '',
                class: 'form-input',
                onchange: (e) => vnode.attrs.item.fecha = e.target.value
            })
        ]),
        m('div.form-group', [
            m('label', { class: 'form-label' }, 'Proveedor:'),
            m(Select, {
                style: { width: '200px' },
                value: vnode.attrs.item.proveedorId || '',
                options: vnode.state.todosProveedores.map(proveedor => ({
                    value: proveedor.id,
                    text: proveedor.nombre
                })),
                onchange: (e) => vnode.attrs.item.proveedorId = e.target.value
            })
        ]),
        m('div.form-group', [
            m('label', { class: 'form-label' }, 'Importe:'),
            m(InputText, {
                type: 'number',
                value: vnode.attrs.item.importe || '',
                class: 'form-input',
                onchange: (e) => vnode.attrs.item.importe = e.target.value
            })
        ]),
        m('div.form-group', [
            m('label', { class: 'form-label' }, 'Estado:'),
            m(Select, {
                style: { width: '200px' },
                value: vnode.attrs.item.estado || '',
                options: [
                    { value: '', text: 'Seleccionar Estado' },
                    { value: 'NUEVO', text: 'NUEVO' },
                    { value: 'ENVIADO', text: 'ENVIADO' }
                ],
                onchange: (e) => vnode.attrs.item.estado = e.target.value
            })
        ]),
        m('div.form-actions', [
            m(Button, { type: 'submit', class: 'btn-submit', label: 'Guardar' }),
            m('span', ' '),
            m(Link, { href: 'javascript:void(0)', onclick: () => window.history.back(), class: 'btn-cancel' }, 'Cancelar')
        ])
    ]
};

export { ordenRenderItem, ordenRenderForm };
