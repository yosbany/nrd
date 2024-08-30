import HomeController from '../controllers/HomeController.js';
import Card from '../../core/ui/Card.js';

const HomeView = {
    oninit: vnode => {
        HomeController.oninit();
    },

    view: vnode => {
        return m(Card, { title: 'Inicio' }, [
            m('div.uk-container.uk-margin-top.uk-flex.uk-flex-center', [
                m('div.uk-width-1-2@m.uk-card.uk-card-default.uk-card-body.uk-text-center', [
                    m('h3', { class: 'uk-card-title' }, 'Bienvenido'),
                    HomeController.user && m('p', { class: 'uk-text-lead' }, `${HomeController.user.email}`),
                    m('button.uk-button.uk-button-danger.uk-margin-top', { onclick: HomeController.logout }, 'Salir')
                ])
            ])
        ]);
    }
};

export default HomeView;
