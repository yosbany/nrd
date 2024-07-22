import SecurityModel from '../models/SecurityModel.js';

const Home = {
    oninit: vnode => {
        console.log("[Audit] Initializing Home component...");

        Home.user = SecurityModel.user;
        Home.role = SecurityModel.role;

        console.log("[Audit] Loaded user:", Home.user);
        console.log("[Audit] Loaded role:", Home.role);
    },
    logout: () => {
        console.log("[Audit] User logging out...");
        SecurityModel.logout();
        console.log("[Audit] User logged out.");
        m.route.set('/login');
    },
    view: vnode => {
        console.log("[Audit] Rendering Home view...");

        return m('div', [
            m('h1', 'Inicio'),
            Home.user && m('p', `Bienvenido, ${Home.user.email}`),
            Home.role && m('p', `Rol: ${Home.role}`),
            m('button', { onclick: Home.logout }, 'Salir')
        ]);
    }
};

export default Home;
