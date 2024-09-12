// src/components/AppBar.js
const AppBar = {
    view: () => {
        return m('div', { class: 'pos-absolute bg-darkCyan fg-white', 'data-role': 'appbar' }, [
            m('a', { href: '#', class: 'app-bar-item d-block d-none-lg', id: 'paneToggle' }, m('span.mif-menu')),
            m('div', { class: 'app-bar-container ml-auto' }, [
                m('a', { href: '#', class: 'app-bar-item' }, [
                    m('span.mif-envelop'),
                    m('span.badge.bg-green.fg-white.mt-2.mr-1', '4')
                ]),
                m('a', { href: '#', class: 'app-bar-item' }, [
                    m('span.mif-bell'),
                    m('span.badge.bg-orange.fg-white.mt-2.mr-1', '10')
                ]),
                m('a', { href: '#', class: 'app-bar-item' }, [
                    m('span.mif-flag'),
                    m('span.badge.bg-red.fg-white.mt-2.mr-1', '9')
                ]),
                m('div', { class: 'app-bar-container' }, [
                    m('a', { href: '#', class: 'app-bar-item' }, [
                        m('img', { src: 'images/jek_vorobey.jpg', class: 'avatar' }),
                        m('span.ml-2.app-bar-name', 'Jack Sparrow')
                    ]),
                    // Aquí se puede incluir el componente del menú de usuario
                ]),
                m('a', { href: '#', class: 'app-bar-item' }, m('span.mif-cogs'))
            ])
        ]);
    }
};

export default AppBar;
