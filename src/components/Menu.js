const Menu = {
    view: () => {
        return m('nav', [
            m('h1', 'Menú Principal'),
            m('ul', [
                m('li', m(m.route.Link, { href: '/usuarios' }, 'Usuarios')),
                m('li', m(m.route.Link, { href: '/proveedores' }, 'Proveedores')),
                m('li', m(m.route.Link, { href: '/ordenes' }, 'Órdenes')),
                m('li', m(m.route.Link, { href: '/articulos' }, 'Artículos'))
            ])
        ]);
    }
};

export default Menu;
