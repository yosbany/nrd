const HorizontalLayout = {
    view: (vnode) => {
        return m('div', { class: `d-flex align-items-center ${vnode.attrs.class || ''}` }, vnode.children);
    }
};

export default HorizontalLayout;
