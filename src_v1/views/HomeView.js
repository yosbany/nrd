import Card from '../components/base/Card.js';
import SecurityModel from '../models/SecurityModel.js';


const HomeView = {
    oninit: vnode => {
        console.log("[Audit][Home] Initializing Home component...");

        HomeView.user = SecurityModel.user;
        HomeView.roles = SecurityModel.roles;

        console.log("[Audit][Home] Loaded user:", HomeView.user);
        console.log("[Audit][Home] Loaded roles:", HomeView.roles);
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
                HomeView.user && m('p', `Bienvenido, ${HomeView.user.email}`),
                HomeView.roles && HomeView.roles.length > 0 && m('p', `Roles: ${HomeView.roles.join(', ')}`),
                m('button.uk-button.uk-button-danger', { onclick: HomeView.logout }, 'Salir')
            ])
        ]);
    }
};

export default HomeView;
