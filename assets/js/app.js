import loadRoute from './router.js';


window.addEventListener('load', loadRoute());
window.addEventListener('hashchange', loadRoute());