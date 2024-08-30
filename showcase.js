import Card from "./src/core/ui/v1.1/Card.js";
import Container from "./src/core/ui/v1.1/Container.js";
import Grid from "./src/core/ui/v1.1/Grid.js";
import Page from "./src/core/ui/v1.1/Page.js";


const App = {
    view: () => {
        return m(Container, { size: 'expand' }, [
            m(Page, {
                title: 'Mi Título de Página',
                breadcrumbs: [
                    { name: 'Inicio', href: '/' },
                    { name: 'Sección', href: '/seccion' },
                    { name: 'Página Actual', href: '/pagina-actual' }
                ]
            }, [
                m(Grid, {},[
                    m(Card, { background: 'primary'}, 'Contenido de la tarjeta 1'),
                    m(Card, { background: 'secondary'}, 'Contenido de la tarjeta 2')
                ])
            ])
        ]);
    }
};

// Montar la aplicación en el DOM
m.mount(document.body, App);
