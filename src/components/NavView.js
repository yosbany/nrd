// src/components/NavView.js
const NavView = {
    view: () => {
        return m('div', { class: 'navview-pane' }, [
            m('div', { class: 'bg-cyan d-flex flex-align-center' }, [
                m('button', { class: 'pull-button m-0 bg-darkCyan-hover' }, m('span.mif-menu.fg-white')),
                m('h2', { class: 'text-light m-0 fg-white pl-7', style: { lineHeight: '52px' } }, 'Pandora')
            ]),
            m('ul', { class: 'navview-menu mt-4' }, [
                m('li.item-header', 'MAIN NAVIGATION'),
                m('li', m('a', { href: '#dashboard' }, [
                    m('span.icon', m('span.mif-meter')),
                    m('span.caption', 'Dashboard')
                ])),
                m('li', m('a', { href: '#widgets' }, [
                    m('span.icon', m('span.mif-widgets')),
                    m('span.caption', 'Widgets')
                ])),
                m('li', [
                    m('a.dropdown-toggle', { href: '#' }, [
                        m('span.icon', m('span.mif-versions')),
                        m('span.caption', 'Sample Pages')
                    ]),
                    m('ul.navview-menu.stay-open', [
                        m('li.item-header', 'Pages'),
                        m('li', m('a', { href: 'login.html' }, 'Login')),
                        m('li', m('a', { href: 'register.html' }, 'Register')),
                        m('li', m('a', { href: 'lockscreen.html' }, 'Lock screen'))
                    ])
                ])
            ])
        ]);
    }
};

export default NavView;
