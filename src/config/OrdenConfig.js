import FirebaseModel from '../models/FirebaseModel.js';

const ordenRenderItem = {
    header: ['Fecha', 'Proveedor', 'Importe', 'Estado', 'Acciones'],
    body: (item, onDelete) => {
        return m('tr', [
            m('td', item.fecha),
            m('td', item.proveedor),
            m('td', item.importe),
            m('td', item.estado),
            m('td', [
                m(m.route.Link, { href: `/ordenes/editar/${item.id}` }, 'Editar'),
                m('span', ' | '),
                m('a', {
                    href: 'javascript:void(0)',
                    onclick: () => onDelete(item.id)
                }, 'Eliminar')
            ])
        ]);
    }
};

const ordenRenderForm = (vnode) => {
    let todosProveedores = [];

    // Obtener todos los proveedores disponibles al iniciar el componente
    vnode.oninit = () => {
        FirebaseModel.getAll('proveedores').then(proveedores => {
            todosProveedores = proveedores || [];
            m.redraw();
        });
    };

    return [
        m('div.form-group', [
            m('label', { class: 'form-label' }, 'Fecha:'),
            m('input[type=text]', {
                value: vnode.attrs.item.fecha || '',
                class: 'form-input',
                onchange: (e) => vnode.attrs.item.fecha = e.target.value
            })
        ]),
        m('div.form-group', [
            m('label', { class: 'form-label' }, 'Proveedor:'),
            m('select', {
                style: { width: '200px' },
                value: vnode.attrs.item.proveedorId || '',
                onchange: (e) => vnode.attrs.item.proveedorId = e.target.value
            }, [
                m('option', { value: '' }, 'Seleccionar Proveedor'),
                ...todosProveedores.map(proveedor =>
                    m('option', { value: proveedor.id }, proveedor.nombre)
                )
            ]),
        ]),
        m('div.form-group', [
            m('label', { class: 'form-label' }, 'Importe:'),
            m('input[type=number]', {
                value: vnode.attrs.item.importe || '',
                class: 'form-input',
                onchange: (e) => vnode.attrs.item.importe = e.target.value
            })
        ]),
        m('div.form-group', [
            m('label', { class: 'form-label' }, 'Estado:'),
            m('select', {
                style: { width: '200px' },
                value: vnode.attrs.item.estado || '',
                onchange: (e) => vnode.attrs.item.estado = e.target.value
            }, [
                m('option', { value: '' }, 'Seleccionar Estado'),
                m('option', { value: 'NUEVO' }, 'NUEVO'),
                m('option', { value: 'ENVIADO' }, 'ENVIADO')
            ]),
        ]),
        m('div.form-actions', [
            m('button[type=submit]', { class: 'btn-submit' }, 'Guardar'),
            m('span', ' '),
            m('a', { href: 'javascript:void(0)', onclick: () => window.history.back(), class: 'btn-cancel' }, 'Cancelar')
        ])
    ];
};

export { ordenRenderItem, ordenRenderForm };
