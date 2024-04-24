// main.js
import { includeTemplate } from './util.js';
import { handleRoute } from './router.js';

// Incluye las partes comunes
includeTemplate('../templates/header.html', 'header');
includeTemplate('../templates/footer.html', 'footer');

// Importa los controladores de las páginas
import { homeController } from './pages/controllers/homeController.js';
import { aboutController } from './pages/controllers/aboutController.js';
import { contactController } from './pages/controllers/contactController.js';



window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);