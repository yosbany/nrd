const NavTabs = {
    oninit: (vnode) => {
        vnode.state.activeTab = 0;
    },
    view: (vnode) => {
        const { tabs } = vnode.attrs;
        const { activeTab } = vnode.state;

        return m('div', [
            m('ul', { class: 'nav nav-tabs' }, 
                tabs.map((tab, index) => 
                    m('li', { class: 'nav-item' }, 
                        m('a', {
                            class: `nav-link ${activeTab === index ? 'active' : ''}`,
                            href: 'javascript:void(0)',
                            onclick: () => vnode.state.activeTab = index
                        }, tab.label)
                    )
                )
            ),
            m('div', { class: 'tab-content' }, 
                tabs[activeTab].content
            )
        ]);
    }
};

export default NavTabs;
