const Menu = {
    view: () => {
        return m('nav.menu', [
            m('h1.menu-title', 'Menú Principal'),
            m('ul.menu-list', [
                m('li.menu-item', m(m.route.Link, { href: '/usuarios' }, 'Usuarios')),
                m('li.menu-item', m(m.route.Link, { href: '/proveedores' }, 'Proveedores')),
                m('li.menu-item', m(m.route.Link, { href: '/ordenes' }, 'Órdenes')),
                m('li.menu-item', m(m.route.Link, { href: '/articulos' }, 'Artículos')),
                m('li.menu-item', m(m.route.Link, { href: '/example' }, 'Ejemplos'))
            ])
        ]);
    }
};

export default Menu;
