const TextArea = {
    view: (vnode) => {
        return m('div', [
            vnode.attrs.label ? m('label', { class: 'label' }, vnode.attrs.label) : null,
            m('textarea', {
                class: 'textarea',
                value: vnode.attrs.value,
                oninput: vnode.attrs.oninput
            })
        ]);
    }
};

export default TextArea;
