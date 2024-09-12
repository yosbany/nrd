// src/components/App.js
import SideNav from './SideNav.js';

const App = {
    view: () => {
        return m('div', { class: 'h-vh-100 d-flex' }, [
            // Menú lateral
            m(SideNav),
            // Contenido principal
            m('div', { class: 'content p-4' }, [
                m('h1', 'Bienvenido al Dashboard'),
                m('p', 'Este es un ejemplo de integración de Metro UI con Mithril para un menú lateral.')
            ])
        ]);
    }
};

export default App;
