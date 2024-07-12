import Menu from '../components/Menu.js';

const HomeView = {
    view: () => {
        return m('div', [
            m('h1', 'Bienvenido a la Aplicación'),
            m(Menu),
        ]);
    }
};

export default HomeView;
