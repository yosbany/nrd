import Logger from '../app/utils/Logger.js';

class ErrorView {
    view() {
        Logger.error("[ErrorView] Rendering Error view...");

        return m("div.uk-container.uk-text-center.uk-margin-large-top", [
            m("h1.uk-heading-line.uk-text-danger", [
                m("span", "Error en la aplicación")
            ]),
            m("p.uk-text-large", "Algo salió mal. Por favor, intente nuevamente más tarde."),
            m("button.uk-button.uk-button-primary.uk-margin-top", {
                onclick: () => {
                    Logger.error("[ErrorView] Return to home button clicked.");
                    m.route.set('/home');
                }
            }, "Volver al inicio")
        ]);
    }
}

export default ErrorView;
