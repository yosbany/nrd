const Menu = {
    view: () => {
        return m('nav', { class: 'navbar navbar-expand-sm bg-light' }, [
            m('div', { class: 'container-fluid' }, [
                m('ul', { class: 'navbar-nav' }, [
                    m('li', { class: 'nav-item' }, [
                        m(m.route.Link, { class: 'nav-link', href: '/usuarios' }, 'Usuarios')
                    ]),
                    m('li', { class: 'nav-item' }, [
                        m(m.route.Link, { class: 'nav-link', href: '/proveedores' }, 'Proveedores')
                    ]),
                    m('li', { class: 'nav-item' }, [
                        m(m.route.Link, { class: 'nav-link', href: '/ordenes' }, 'Órdenes')
                    ]),
                    m('li', { class: 'nav-item' }, [
                        m(m.route.Link, { class: 'nav-link', href: '/articulos' }, 'Artículos')
                    ])
                ])
            ])
        ]);
    }
};

export default Menu;
