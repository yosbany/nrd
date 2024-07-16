const VerticalLayout = {
    view: (vnode) => {
        return m('div', { class: 'd-flex flex-column' }, vnode.children);
    }
};

export default VerticalLayout;
