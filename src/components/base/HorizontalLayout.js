const HorizontalLayout = {
    view: (vnode) => {
        return m('div', { class: 'horizontal-layout' }, vnode.children);
    }
};

export default HorizontalLayout;
