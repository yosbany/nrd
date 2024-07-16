const Checkbox = {
    view: (vnode) => {
        return m('div', { class: 'form-check' }, [
            m('input', {
                class: 'form-check-input',
                type: 'checkbox',
                id: vnode.attrs.id,
                checked: vnode.attrs.checked,
                onchange: vnode.attrs.onchange
            }),
            m('label', {
                class: 'form-check-label',
                for: vnode.attrs.id
            }, vnode.attrs.label)
        ]);
    }
};

export default Checkbox;
