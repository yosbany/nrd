// src/components/SideNav.js
const SideNav = {
    view: () => {
        return m('ul', { class: 'sidenav-simple h-auto' }, [
            m('li', [
                m('a', { href: '#all-items' }, [
                    m('span', { class: 'mif-apps icon' }),
                    m('span', { class: 'title' }, 'All Items')
                ])
            ]),
            m('li', [
                m('a', { href: '#dashboard' }, [
                    m('span', { class: 'mif-meter icon' }),
                    m('span', { class: 'title' }, 'Dashboard')
                ])
            ]),
            m('li', [
                m('a', { href: '#widgets' }, [
                    m('span', { class: 'mif-widgets icon' }),
                    m('span', { class: 'title' }, 'Widgets')
                ])
            ]),
            m('li', [
                m('a', { href: '#settings' }, [
                    m('span', { class: 'mif-cogs icon' }),
                    m('span', { class: 'title' }, 'Settings')
                ])
            ]),
            m('li', [
                m('a', { href: '#profile' }, [
                    m('span', { class: 'mif-user icon' }),
                    m('span', { class: 'title' }, 'Profile')
                ])
            ])
        ]);
    }
};

export default SideNav;
