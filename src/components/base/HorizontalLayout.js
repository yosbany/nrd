const HorizontalLayout = {
    view: (vnode) => {
        return m('div', { class: 'd-flex align-items-center' }, vnode.children);
    }
};

export default HorizontalLayout;
