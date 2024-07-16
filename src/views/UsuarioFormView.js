import FirebaseModel from '../models/FirebaseModel.js';
import VerticalLayout from '../components/base/VerticalLayout.js';
import InputText from '../components/base/InputText.js';
import Button from '../components/base/Button.js';
import Link from '../components/base/Link.js';

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

        return m(VerticalLayout, [
            m('h2', 'Formulario de Usuario'),
            m('form', {
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
                m('div', { class: 'd-flex justify-content-between' }, [
                    m(Button, { type: 'submit', label: 'Guardar' }),
                    m(Link, { href: 'javascript:void(0)', onclick: () => window.history.back(), text: 'Cancelar' })
                ])
            ])
        ]);
    }
};

export default UsuarioFormView;
