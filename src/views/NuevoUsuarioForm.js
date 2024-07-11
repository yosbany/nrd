// views/NuevoUsuarioForm.js

import m from 'https://cdn.jsdelivr.net/npm/mithril/mithril.js';
import UserController from '../controllers/UserController';

const NuevoUsuarioForm = {
    oninit: () => {
        UserController.NuevoUsuarioForm.usuario = {}; // Limpiar datos al cargar formulario nuevo
    },
    view: UserController.NuevoUsuarioForm.view
};

export default NuevoUsuarioForm;
