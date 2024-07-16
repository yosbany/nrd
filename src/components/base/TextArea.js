const TextArea = {
    view: (vnode) => {
        return m('div', { class: 'mb-3' }, [
            vnode.attrs.label && m('label', { class: 'form-label' }, vnode.attrs.label),
            m('textarea', {
                class: 'form-control',
                value: vnode.attrs.value,
                onchange: vnode.attrs.onchange,
                placeholder: vnode.attrs.placeholder || ''
            })
        ]);
    }
};

export default TextArea;
