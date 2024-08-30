import MenuConfig from "../config/MenuConfig.js";
import Logger from '../utils/Logger.js';

const MainController = {
    categories: {},
    directLinks: [],

    initializeMenu() {
        // Agrupar rutas por categoría y manejar las que no tienen categoría
        Object.keys(MenuConfig).forEach(entityKey => {
            const config = MenuConfig[entityKey];
            if (config.category) {
                const category = config.category;
                if (!this.categories[category]) {
                    this.categories[category] = [];
                }
                this.categories[category].push({ ...config, key: entityKey });
            } else {
                this.directLinks.push({ ...config, key: entityKey });
            }
        });
        Logger.info('[MainController] Menú inicializado correctamente.');
    },

    navigateToRoute(route) {
        try {
            Logger.info("[MainController] Navigating to route:", route.pathRouter);
            m.route.set(route.pathRouter);

            // Cerrar todos los dropdowns abiertos
            const dropdowns = document.querySelectorAll('.uk-dropdown');
            dropdowns.forEach(dropdown => {
                UIkit.dropdown(dropdown).hide();
            });

            // Cerrar el menú Offcanvas si está abierto
            const offcanvas = document.querySelector("#offcanvas-nav");
            if (offcanvas.classList.contains("uk-open")) {
                UIkit.offcanvas(offcanvas).hide();
            }
        } catch (error) {
            Logger.error("[MainController] Error al navegar a la ruta:", error);
            m.route.set('/error', { message: error.message });
        }
    }
};

export default MainController;
