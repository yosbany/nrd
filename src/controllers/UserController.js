// controllers/UserController.js

import m from 'https://unpkg.com/mithril/mithril.js';
import FirebaseModel from '../models/FirebaseModel.js';

const UserController = {
    // Componente de lista de usuarios
    UserList: {
        users: [],

        oninit: () => {
            FirebaseModel.getAll('usuarios')
                .then(users => {
                    UserController.UserList.users = users || [];
                    m.redraw(); // Forzar actualización de la vista
                });
        },

        view: () => {
            return m('div', [
                m('h2', 'Lista de Usuarios'),
                m('ul', UserController.UserList.users.map(user =>
                    m('li', user.nombre)
                )),
                m('a', { href: '/nuevo-usuario', oncreate: m.route.Link }, 'Agregar Usuario')
            ]);
        }
    },

    // Componente de formulario de nuevo usuario
    NuevoUsuarioForm: {
        usuario: {},

        saveOrUpdate: () => {
            FirebaseModel.saveOrUpdate('usuarios', UserController.NuevoUsuarioForm.usuario.id, UserController.NuevoUsuarioForm.usuario)
                .then(() => {
                    UserController.NuevoUsuarioForm.usuario = {};
                    m.route.set('/');
                });
        },

        view: () => {
            return m('div', [
                m('h2', 'Agregar/Editar Usuario'),
                m('form', {
                    onsubmit: (e) => {
                        e.preventDefault();
                        UserController.NuevoUsuarioForm.saveOrUpdate();
                    }
                }, [
                    m('label', 'Nombre:'),
                    m('input[type=text]', {
                        value: UserController.NuevoUsuarioForm.usuario.nombre,
                        onchange: (e) => UserController.NuevoUsuarioForm.usuario.nombre = e.target.value
                    }),
                    m('br'),
                    m('button[type=submit]', 'Guardar')
                ])
            ]);
        }
    }
};

export default UserController;
