import FirebaseAuth from "../services/FirebaseAuth.js";
import Logger from "../utils/Logger.js";

const HomeController = {
    user: null,
    roles: [],

    async oninit() {
        Logger.info("[Audit][HomeController] Initializing Home controller...");

        try {
            this.user = FirebaseAuth.getCurrentUser();  // Obtener el usuario actual desde FirebaseAuth
            if (this.user) {
                this.roles = await FirebaseAuth.getUserRoles();  // Asumimos que hay un método para obtener los roles del usuario
                Logger.info("[Audit][HomeController] Loaded user:", this.user);
                Logger.info("[Audit][HomeController] Loaded roles:", this.roles);
                m.redraw();
            } else {
                Logger.warn("[Audit][HomeController] No user found during initialization.");
                m.route.set('/login');  // Redirigir a la página de login si no hay usuario
            }
        } catch (error) {
            Logger.error("[Audit][HomeController] Error during initialization:", error);
        }
    },

    async logout() {
        Logger.info("[Audit][HomeController] User logging out...");
        try {
            await FirebaseAuth.logout();
            Logger.info("[Audit][HomeController] User logged out.");
            m.route.set('/login');  // Redirigir a la página de login después de cerrar sesión
        } catch (error) {
            Logger.error("[Audit][HomeController] Error during logout:", error);
        }
    }
};

export default HomeController;
