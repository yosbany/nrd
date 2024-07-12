import Menu from '../components/Menu.js';

const HomeView = () => {
    return m('div', [
        m(Menu),
        m('h2', 'Selecciona una opción del menú')
        // Puedes agregar más contenido aquí si es necesario
    ]);
};

export default HomeView;
