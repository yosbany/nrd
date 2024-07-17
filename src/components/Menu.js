import Link from './base/Link.js';

const Menu = {
    view: () => {
        return m('div', { class: 'menu' }, 
            m('div', { class: 'menu-container' }, [
                m(Link, { href: '/home', className: 'menu-item' }, 'Inicio'),
                m(Link, { href: '/usuarios', className: 'menu-item' }, 'Usuarios'),
                m(Link, { href: '/proveedores', className: 'menu-item' }, 'Proveedores'),
                m(Link, { href: '/ordenes', className: 'menu-item' }, 'Ordenes'),
                m(Link, { href: '/articulos', className: 'menu-item' }, 'Artículos')
            ])
        );
    }
};

export default Menu;
