import FirebaseModel from '../models/FirebaseModel.js';
import { Button, InputText, Link } from '../components/base';

const UsuarioFormView = {
    oninit: (vnode) => {
        if (vnode.attrs.id) {
            FirebaseModel.getById('usuarios', vnode.attrs.id).then(item => {
                vnode.state.item = item;
                m.redraw();
            });
        } else {
            vnode.state.item = {};
        }
    },
    view: (vnode) => {
        const item = vnode.state.item;

        return m('form', {
            onsubmit: (e) => {
                e.preventDefault();
                FirebaseModel.saveOrUpdate('usuarios', vnode.attrs.id, item).then(() => {
                    m.route.set('/usuarios');
                });
            }
        }, [
            m('div.form-group', [
                m('label', { class: 'form-label' }, 'Nombre:'),
                m(InputText, {
                    value: item.nombre || '',
                    oninput: (e) => item.nombre = e.target.value
                })
            ]),
            m('div.form-actions', [
                m(Button, { type: 'submit', label: 'Guardar' }),
                m('span', ' '),
                m(Link, { href: 'javascript:void(0)', onclick: () => window.history.back(), text: 'Cancelar' })
            ])
        ]);
    }
};

export default UsuarioFormView;
