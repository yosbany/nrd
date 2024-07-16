const Button = {
    view: (vnode) => {
        return m('button', {
            type: 'button',
            class: 'btn',
            onclick: vnode.attrs.onclick
        }, vnode.children || vnode.attrs.label);
    }
};

export default Button;
