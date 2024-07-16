const Button = {
    view: (vnode) => {
        return m('button', {
            type: 'button',
            class: 'btn',
            onclick: vnode.attrs.onclick
        }, vnode.attrs.label || vnode.children);
    }
};

export default Button;
