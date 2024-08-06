import SecurityModel from '../models/SecurityModel.js';
import Card from './base/Card.js';

const Home = {
    oninit: vnode => {
        console.log("[Audit][Home] Initializing Home component...");

        Home.user = SecurityModel.user;
        Home.role = SecurityModel.role;

        console.log("[Audit][Home] Loaded user:", Home.user);
        console.log("[Audit][Home] Loaded role:", Home.role);
    },

    logout: () => {
        console.log("[Audit][Home] User logging out...");
        SecurityModel.logout();
        console.log("[Audit][Home] User logged out.");
        m.route.set('/login');
    },

    view: vnode => {
        console.log("[Audit][Home] Rendering Home view...");

        return m(Card, { title: 'Inicio' }, [
            m('div.uk-container.uk-margin-top', [
                Home.user && m('p', `Bienvenido, ${Home.user.email}`),
                Home.role && m('p', `Rol: ${Home.role}`),
                m('button.uk-button.uk-button-danger', { onclick: Home.logout }, 'Salir')
            ])
        ]);
    }
};

export default Home;
