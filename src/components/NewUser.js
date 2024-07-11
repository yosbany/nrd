import m from 'https://cdn.jsdelivr.net/npm/mithril/mithril.mjs';
import FirebaseModel from '../models/FirebaseModel.js';

const NewUser = {
    usuario: {},

    saveOrUpdate: () => {
        FirebaseModel.saveOrUpdate('usuarios', NewUser.usuario.id, NewUser.usuario)
            .then(() => {
                NewUser.usuario = {};
                m.route.set('/');
            });
    },

    view: () => {
        return m('div', [
            m('h2', 'Agregar/Editar Usuario'),
            m('form', {
                onsubmit: (e) => {
                    e.preventDefault();
                    NewUser.saveOrUpdate();
                }
            }, [
                m('label', 'Nombre:'),
                m('input[type=text]', {
                    value: NewUser.usuario.nombre,
                    onchange: (e) => NewUser.usuario.nombre = e.target.value
                }),
                m('br'),
                m('button[type=submit]', 'Guardar')
            ])
        ]);
    }
};

export default NewUser;
