import InputText from '../components/base/InputText.js';
import Button from '../components/base/Button.js';
import Link from '../components/base/Link.js';
import FirebaseModel from '../models/FirebaseModel.js';

const UsuarioFormView = {
    oninit: (vnode) => {
        vnode.state.item = {};
        if (vnode.attrs.id) {
            FirebaseModel.getById('usuarios', vnode.attrs.id).then(item => {
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
                FirebaseModel.saveOrUpdate('usuarios', vnode.attrs.id, item).then(() => {
                    m.route.set('/usuarios');
                });
            }
        }, [
            m(InputText, {
                label: 'Nombre',
                value: item.nombre || '',
                oninput: (e) => item.nombre = e.target.value
            }),
            m('div.d-flex.mt-3', [
                m(Button, { type: 'submit', class: 'btn btn-primary', label: 'Guardar' }),
                m(Link, { href: 'javascript:void(0)', onclick: () => window.history.back(), class: 'btn btn-secondary ms-2', text: 'Cancelar' })
            ])
        ]);
    }
};

export default UsuarioFormView;
