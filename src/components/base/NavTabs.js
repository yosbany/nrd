const NavTabs = {
    view: (vnode) => {
        return m('ul', { class: 'nav nav-tabs' }, vnode.attrs.tabs.map(tab => 
            m('li', { class: 'nav-item' }, 
                m(m.route.Link, { class: `nav-link ${tab.active ? 'active' : ''}`, href: tab.href }, tab.label)
            )
        ));
    }
};

export default NavTabs;
