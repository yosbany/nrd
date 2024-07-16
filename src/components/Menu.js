const Menu = {
    oninit: (vnode) => {
        vnode.state.isResponsive = false;
    },
    view: (vnode) => {
        const { isResponsive } = vnode.state;

        return m('div', {
            class: `menu ${isResponsive ? 'responsive' : ''}`
        }, [
            m('a', {
                href: 'javascript:void(0);',
                class: 'icon',
                onclick: () => vnode.state.isResponsive = !isResponsive
            }, m('i', { class: 'fa fa-bars' })),
            m(m.route.Link, { href: '/usuarios' }, 'Usuarios'),
            m(m.route.Link, { href: '/proveedores' }, 'Proveedores'),
            m(m.route.Link, { href: '/ordenes' }, 'Órdenes'),
            m(m.route.Link, { href: '/articulos' }, 'Artículos'),
            m(m.route.Link, { href: '/example' }, 'Ejemplos')
        ]);
    }
};

export default Menu;
