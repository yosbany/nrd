const NavTabs = {
    view: (vnode) => {
        const { tabs } = vnode.attrs;

        return m('div', [
            m('ul', { class: 'nav nav-tabs' }, 
                tabs.map((tab, index) => 
                    m('li', { class: 'nav-item' }, 
                        m('a', {
                            class: `nav-link ${tab.active ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`,
                            href: tab.href || 'javascript:void(0)',
                            'aria-current': tab.active ? 'page' : undefined,
                            'aria-disabled': tab.disabled ? 'true' : undefined,
                            onclick: tab.onclick
                        }, tab.label)
                    )
                )
            ),
            tabs.map((tab, index) => 
                m('div', {
                    class: `tab-pane ${tab.active ? 'active' : ''}`,
                    id: `tab-${index}`,
                    role: 'tabpanel',
                    'aria-labelledby': `tab-${index}-tab`
                }, tab.active ? tab.content : null)
            )
        ]);
    }
};

export default NavTabs;
