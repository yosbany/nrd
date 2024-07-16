const Button = {
    view: (vnode) => {
        return m('button', {
            class: 'button',
            onclick: vnode.attrs.onclick
        }, vnode.children);
    }
};

export default Button;
