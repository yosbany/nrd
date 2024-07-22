import SecurityModel from '../models/SecurityModel.js';

const Login = {
    email: '',
    password: '',
    error: '',

    login: () => {
        console.log("[Audit] Attempting login with email:", Login.email);
        SecurityModel.login(Login.email, Login.password).then(() => {
            if (SecurityModel.isAuthenticated()) {
                console.log("[Audit] Login successful for email:", Login.email);
                m.route.set('/home');
            } else {
                Login.error = SecurityModel.error;
                console.error("[Audit] Login failed for email:", Login.email, "Error:", Login.error);
                m.redraw();
            }
        }).catch(error => {
            console.error("[Audit] Login encountered an error for email:", Login.email, "Error:", error);
            Login.error = "Ocurrió un error durante el inicio de sesión.";
            m.redraw();
        });
    },

    view: () => {
        console.log("[Audit] Rendering Login view...");

        return m('div.login-container', [
            m('h1', 'Por favor autentíquese...'),
            m('form.login-form', {
                onsubmit: e => {
                    e.preventDefault();
                    Login.login();
                }
            }, [
                m('div.form-group', [
                    m('input[type=email]', {
                        placeholder: 'Email',
                        value: Login.email,
                        oninput: e => {
                            console.log("[Audit] Email input changed:", e.target.value);
                            Login.email = e.target.value;
                        },
                        class: 'form-input'
                    })
                ]),
                m('div.form-group', [
                    m('input[type=password]', {
                        placeholder: 'Contraseña',
                        value: Login.password,
                        oninput: e => {
                            console.log("[Audit] Password input changed");
                            Login.password = e.target.value;
                        },
                        class: 'form-input'
                    })
                ]),
                m('div.form-group', [
                    m('button[type=submit]', { class: 'form-button' }, 'Entrar')
                ]),
                Login.error && m('div.error', Login.error)
            ])
        ]);
    }
};

export default Login;
