const Menu = {
    oninit: (vnode) => {
        vnode.state.isResponsive = false;
    },
    view: (vnode) => {
        const { isResponsive } = vnode.state;

        return m('nav', { class: `menu ${isResponsive ? 'responsive' : ''}` }, [
            m('a', {
                href: 'javascript:void(0);',
                class: 'icon',
                onclick: () => vnode.state.isResponsive = !isResponsive
            }, m('i', { class: 'fa fa-bars' })),
            m(m.route.Link, { href: '/usuarios', class: 'menu-item' }, 'Usuarios'),
            m(m.route.Link, { href: '/proveedores', class: 'menu-item' }, 'Proveedores'),
            m(m.route.Link, { href: '/ordenes', class: 'menu-item' }, 'Órdenes'),
            m(m.route.Link, { href: '/articulos', class: 'menu-item' }, 'Artículos')
        ]);
    }
};

export default Menu;
