import InputText from '../components/base/InputText.js';
import Link from '../components/base/Link.js';
import Button from '../components/base/Button.js';
import FirebaseModel from '../models/FirebaseModel.js';
import VerticalLayout from '../components/base/VerticalLayout.js';

const ProveedorFormView = {
    oninit: (vnode) => {
        vnode.state.item = {};
        if (vnode.attrs.id) {
            FirebaseModel.getById('proveedores', vnode.attrs.id).then(item => {
                vnode.state.item = item;
                m.redraw();
            });
        } 
    },
    view: (vnode) => {
        const item = vnode.state.item;

        return m('form', {
            onsubmit: (e) => {
                e.preventDefault();
                FirebaseModel.saveOrUpdate('proveedores', vnode.attrs.id, item).then(() => {
                    m.route.set('/proveedores');
                });
            }
        }, m(VerticalLayout, [
            m(InputText, {
                label: 'Código',
                value: item.codigo || '',
                onchange: (e) => item.codigo = e.target.value
            }),
            m(InputText, {
                label: 'Nombre',
                value: item.nombre || '',
                onchange: (e) => item.nombre = e.target.value
            }),
            m('div.form-actions', [
                m(Button, { type: 'submit', class: 'btn-submit' }, 'Guardar'),
                m('span', ' '),
                m(Link, { href: 'javascript:void(0)', onclick: () => window.history.back(), class: 'btn-cancel' }, 'Cancelar')
            ])
        ]));
    }
};

export default ProveedorFormView;
