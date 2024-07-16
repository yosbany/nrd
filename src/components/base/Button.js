const Button = {
    view: (vnode) => {
        return m('button', {
            class: `btn btn-${vnode.attrs.type || 'primary'}`,
            onclick: vnode.attrs.onclick,
            type: vnode.attrs.type || 'button'
        }, vnode.attrs.label || vnode.children);
    }
};

export default Button;
