const InputNumber = {
    view: (vnode) => {
        return m('div', [
            vnode.attrs.label ? m('label', { class: 'label' }, vnode.attrs.label) : null,
            m('input[type=number]', {
                class: 'input',
                value: vnode.attrs.value,
                oninput: vnode.attrs.oninput
            })
        ]);
    }
};

export default InputNumber;
