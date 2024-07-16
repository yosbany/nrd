const VerticalLayout = {
    view: (vnode) => {
        return m('div', { class: 'vertical-layout' }, vnode.children);
    }
};

export default VerticalLayout;
