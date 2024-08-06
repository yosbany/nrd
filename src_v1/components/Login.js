import SecurityModel from '../models/SecurityModel.js';
import Card from './base/Card.js';
import Fila from './base/Fila.js';
import Column from './base/Column.js';

const Login = {
    email: '',
    password: '',
    error: '',
    loading: false,

    login: () => {
        console.log("[Audit][Login] Attempting login with email:", Login.email);
        Login.loading = true;
        SecurityModel.login(Login.email, Login.password).then(() => {
            Login.loading = false;
            if (SecurityModel.isAuthenticated()) {
                console.log("[Audit][Login] Login successful for email:", Login.email);
                m.route.set('/home');
            } else {
                Login.error = SecurityModel.error;
                console.error("[Audit][Login] Login failed for email:", Login.email, "Error:", Login.error);
                m.redraw();
            }
        }).catch(error => {
            console.error("[Audit][Login] Login encountered an error for email:", Login.email, "Error:", error);
            Login.error = "Ocurrió un error durante el inicio de sesión.";
            Login.loading = false;
            m.redraw();
        });
    },

    view: () => {
        console.log("[Audit][Login] Rendering Login view...");

        return m('div.uk-flex.uk-flex-center.uk-flex-middle.uk-height-viewport.uk-background-muted', [
            m(Fila, { gap: 'small' }, [
                m(Column, { width: '1-12' }, [
                    m(Card, { title: 'NUEVA RÍO DOR' }, [
                        m('form.uk-form-stacked', {
                            onsubmit: e => {
                                e.preventDefault();
                                if (!Login.loading) Login.login();
                            }
                        }, [
                            m('div.uk-margin', [
                                m('label.uk-form-label', { for: 'email' }, 'Email'),
                                m('div.uk-form-controls', [
                                    m('input#email.uk-input[aria-label="Email"][type=email]', {
                                        placeholder: 'Email',
                                        value: Login.email,
                                        oninput: e => {
                                            console.log("[Audit][Login] Email input changed:", e.target.value);
                                            Login.email = e.target.value;
                                        }
                                    })
                                ])
                            ]),
                            m('div.uk-margin', [
                                m('label.uk-form-label', { for: 'password' }, 'Contraseña'),
                                m('div.uk-form-controls', [
                                    m('input#password.uk-input[aria-label="Contraseña"][type=password]', {
                                        placeholder: 'Contraseña',
                                        value: Login.password,
                                        oninput: e => {
                                            console.log("[Audit][Login] Password input changed");
                                            Login.password = e.target.value;
                                        }
                                    })
                                ])
                            ]),
                            m('div.uk-margin', [
                                m('button.uk-button.uk-button-primary.uk-width-1-1[type=submit]', 
                                  { disabled: Login.loading }, 
                                  Login.loading ? "Cargando..." : "Entrar")
                            ]),
                            Login.error && m('div.uk-margin.uk-alert-danger[aria-live="assertive"]', { 'uk-alert': true }, Login.error)
                        ])
                    ])
                ])
            ])
        ]);
    }
};

export default Login;
