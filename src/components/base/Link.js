const Link = {
    view: (vnode) => {
        return m('a', {
            class: 'link',
            href: vnode.attrs.href,
            onclick: vnode.attrs.onclick
        }, vnode.children || vnode.attrs.text);
    }
};

export default Link;
