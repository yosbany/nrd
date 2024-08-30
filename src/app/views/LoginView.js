import LoginController from "../controllers/LoginController.js";
import Logger from '../utils/Logger.js';

const LoginView = {
    view: () => {
        Logger.info("[Audit][Login] Rendering Login view...");

        return m("div.uk-section.uk-section-muted.uk-flex.uk-flex-middle.uk-animation-fade", { "uk-height-viewport": true }, [
            m("div.uk-width-1-1", [
                m("div.uk-container", [
                    m("div.uk-grid-margin.uk-grid.uk-grid-stack", { "uk-grid": true }, [
                        m("div.uk-width-1-1@m", [
                            m("div.uk-margin.uk-width-large.uk-margin-auto.uk-card.uk-card-default.uk-card-body.uk-box-shadow-large", [
                                m("h3.uk-card-title.uk-text-center", "NUEVA RÍO D'OR"),
                                m("form", {
                                    onsubmit: e => {
                                        e.preventDefault();
                                        if (!LoginController.loading) LoginController.login();
                                    }
                                }, [
                                    m("div.uk-margin", [
                                        m("div.uk-inline.uk-width-1-1", [
                                            m("span.uk-form-icon", { "uk-icon": "icon: mail" }),
                                            m("input.uk-input.uk-form-large[type=email]", {
                                                placeholder: "Email",
                                                value: LoginController.email,
                                                oninput: e => {
                                                    Logger.info("[Audit][Login] Email input changed:", e.target.value);
                                                    LoginController.email = e.target.value;
                                                }
                                            })
                                        ])
                                    ]),
                                    m("div.uk-margin", [
                                        m("div.uk-inline.uk-width-1-1", [
                                            m("span.uk-form-icon", { "uk-icon": "icon: lock" }),
                                            m("input.uk-input.uk-form-large[type=password]", {
                                                placeholder: "Contraseña",
                                                value: LoginController.password,
                                                oninput: e => {
                                                    Logger.info("[Audit][Login] Password input changed");
                                                    LoginController.password = e.target.value;
                                                }
                                            })
                                        ])
                                    ]),
                                    m("div.uk-margin", [
                                        m("button.uk-button.uk-button-primary.uk-button-large.uk-width-1-1[type=submit]", 
                                          { disabled: LoginController.loading }, 
                                          LoginController.loading ? "Entrando..." : "Entrar")
                                    ]),
                                    LoginController.error && m("div.uk-margin.uk-alert-danger[aria-live='assertive']", { "uk-alert": true }, LoginController.error),
                                ])
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    }
};

export default LoginView;
