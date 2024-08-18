import SecurityModel from "../models/SecurityModel.js";

const LoginView = {
    email: '',
    password: '',
    error: '',
    loading: false,

    login: () => {
        console.log("[Audit][Login] Attempting login with email:", LoginView.email);
        LoginView.loading = true;
        SecurityModel.login(LoginView.email, LoginView.password).then(() => {
            LoginView.loading = false;
            if (SecurityModel.isAuthenticated()) {
                console.log("[Audit][Login] Login successful for email:", LoginView.email);
                m.route.set('/home');
            } else {
                LoginView.error = SecurityModel.error;
                console.error("[Audit][Login] Login failed for email:", LoginView.email, "Error:", LoginView.error);
                m.redraw();
            }
        }).catch(error => {
            console.error("[Audit][Login] Login encountered an error for email:", LoginView.email, "Error:", error);
            LoginView.error = "Ocurrió un error durante el inicio de sesión.";
            LoginView.loading = false;
            m.redraw();
        });
    },

    view: () => {
        console.log("[Audit][Login] Rendering Login view...");

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
                                        if (!LoginView.loading) LoginView.login();
                                    }
                                }, [
                                    m("div.uk-margin", [
                                        m("div.uk-inline.uk-width-1-1", [
                                            m("span.uk-form-icon", { "uk-icon": "icon: mail" }),
                                            m("input.uk-input.uk-form-large[type=email]", {
                                                placeholder: "Email",
                                                value: LoginView.email,
                                                oninput: e => {
                                                    console.log("[Audit][Login] Email input changed:", e.target.value);
                                                    LoginView.email = e.target.value;
                                                }
                                            })
                                        ])
                                    ]),
                                    m("div.uk-margin", [
                                        m("div.uk-inline.uk-width-1-1", [
                                            m("span.uk-form-icon", { "uk-icon": "icon: lock" }),
                                            m("input.uk-input.uk-form-large[type=password]", {
                                                placeholder: "Contraseña",
                                                value: LoginView.password,
                                                oninput: e => {
                                                    console.log("[Audit][Login] Password input changed");
                                                    LoginView.password = e.target.value;
                                                }
                                            })
                                        ])
                                    ]),
                                    m("div.uk-margin", [
                                        m("button.uk-button.uk-button-primary.uk-button-large.uk-width-1-1[type=submit]", 
                                          { disabled: LoginView.loading }, 
                                          LoginView.loading ? "Entrando..." : "Entrar")
                                    ]),
                                    LoginView.error && m("div.uk-margin.uk-alert-danger[aria-live='assertive']", { "uk-alert": true }, LoginView.error),
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
