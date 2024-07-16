const InputText = {
    view: (vnode) => {
        return m('div', { class: 'mb-3' }, [
            vnode.attrs.label && m('label', { class: 'form-label' }, vnode.attrs.label),
            m('input', {
                class: 'form-control',
                type: 'text',
                value: vnode.attrs.value,
                onchange: vnode.attrs.onchange,
                placeholder: vnode.attrs.placeholder || ''
            })
        ]);
    }
};

export default InputText;
