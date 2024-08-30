import FirebaseAuth from "../services/FirebaseAuth.js";
import Logger from "../utils/Logger.js";

const LoginController = {
    email: '',
    password: '',
    error: '',
    loading: false,

    async login() {
        Logger.info("[Audit][Login] Attempting login with email:", this.email);
        this.loading = true;

        try {
            await FirebaseAuth.login(this.email, this.password);
            this.loading = false;

            if (FirebaseAuth.isAuthenticated()) {
                Logger.info("[Audit][Login] Login successful for email:", this.email);
                m.route.set('/home');
            } else {
                this.error = FirebaseAuth.error || "No se pudo autenticar.";
                Logger.error("[Audit][Login] Login failed for email:", this.email, "Error:", this.error);
                m.redraw();
            }
        } catch (error) {
            Logger.error("[Audit][Login] Login encountered an error for email:", this.email, "Error:", error.message || error);
            this.error = "Ocurrió un error durante el inicio de sesión.";
            this.loading = false;
            m.redraw();
        }
    }
};

export default LoginController;
