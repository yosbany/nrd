const Link = {
    view: (vnode) => {
        return m('a', {
            class: vnode.attrs.class || 'btn btn-link',
            href: vnode.attrs.href || 'javascript:void(0)',
            onclick: vnode.attrs.onclick
        }, vnode.children);
    }
};

export default Link;
