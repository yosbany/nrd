const InputText = {
    view: (vnode) => {
        return m('div', [
            vnode.attrs.label ? m('label', { class: 'label' }, vnode.attrs.label) : null,
            m('input[type=text]', {
                class: 'input-text',
                value: vnode.attrs.value,
                oninput: vnode.attrs.oninput
            })
        ]);
    }
};

export default InputText;
