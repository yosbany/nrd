const Button = {
    view: (vnode) => {
        return m('button', {
            class: `btn ${vnode.attrs.class || 'btn-primary'}`,
            onclick: vnode.attrs.onclick
        }, vnode.children);
    }
};

export default Button;
