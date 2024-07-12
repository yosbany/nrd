import Menu from '../components/Menu.js';

const HomeView = {
    view: () => {
        return m('div', [
            m(Menu),
            m('h1', 'Bienvenido a la Aplicación')
        ]);
    }
};

export default HomeView;
