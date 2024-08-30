import Logger from '../app/utils/Logger.js';

class NotFoundView {
    view() {
        Logger.info("[NotFoundView] Rendering NotFound view...");

        return m("div.uk-container.uk-text-center.uk-margin-large-top", [
            m("h1.uk-heading-line.uk-text-warning", [
                m("span", "Página no encontrada")
            ]),
            m("p.uk-text-large", "La página que está buscando no existe o ha sido movida."),
            m("button.uk-button.uk-button-primary.uk-margin-top", {
                onclick: () => {
                    Logger.info("[NotFoundView] Return to home button clicked.");
                    m.route.set('/home');
                }
            }, "Volver al inicio")
        ]);
    }
}

export default NotFoundView;
