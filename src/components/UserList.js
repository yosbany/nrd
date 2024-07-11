import m from 'https://cdn.jsdelivr.net/npm/mithril/mithril.mjs';
import FirebaseModel from '../models/FirebaseModel.js';

const UserList = {
    users: [],

    oninit: () => {
        FirebaseModel.getAll('usuarios')
            .then(users => {
                UserList.users = users || [];
                m.redraw(); // Forzar actualización de la vista
            });
    },

    view: () => {
        return m('div', [
            m('h2', 'Lista de Usuarios'),
            m('ul', UserList.users.map(user =>
                m('li', user.nombre)
            )),
            m('a', { href: '/nuevo-usuario', oncreate: m.route.Link }, 'Agregar Usuario')
        ]);
    }
};

export default UserList;
