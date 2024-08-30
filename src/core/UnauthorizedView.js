import Logger from '../app/utils/Logger.js';

class UnauthorizedView {
    view() {
        Logger.audit("[UnauthorizedView] Rendering Unauthorized view...");

        return m("div.uk-container.uk-text-center.uk-margin-large-top", [
            m("h1.uk-heading-line.uk-text-danger", [
                m("span", "Acceso no autorizado")
            ]),
            m("p.uk-text-large", "No tiene permiso para acceder a esta página."),
            m("button.uk-button.uk-button-primary.uk-margin-top", {
                onclick: () => {
                    Logger.audit("[UnauthorizedView] Return to home button clicked.");
                    m.route.set('/home');
                }
            }, "Volver al inicio")
        ]);
    }
}

export default UnauthorizedView;
