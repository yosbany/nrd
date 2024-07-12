const Menu = {
    view: (vnode) => {
        return m('nav', [
            m('h1', 'Menú Principal'),
            m('ul', [
                m('li', m.route.Link, { href: '/usuarios' }, 'Usuarios'),
                m('li', m.route.Link, { href: '/proveedores' }, 'Proveedores'),
                m('li', m.route.Link, { href: '/ordenes' }, 'Órdenes'),
                m('li', m.route.Link, { href: '/clientes' }, 'Clientes'),
                m('li', m.route.Link, { href: '/articulos' }, 'Artículos'),
            ])
        ]);
    }
};

export default Menu;
