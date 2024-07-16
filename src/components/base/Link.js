const Link = {
    view: (vnode) => {
        return m(m.route.Link, {
            class: 'link',
            href: vnode.attrs.href,
            onclick: vnode.attrs.onclick
        }, vnode.attrs.text || vnode.children);
    }
};

export default Link;
