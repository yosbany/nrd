import { requireAuth, requireRole } from '../../../middleware/auth-middleware.js';

document.addEventListener('DOMContentLoaded', async function () {
    console.log('Home page loaded.');
    requireAuth();
    requireRole('admin');
});