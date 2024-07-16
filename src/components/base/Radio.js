const Radio = {
    view: (vnode) => {
        return m('div', { class: 'form-check' }, [
            m('input', {
                class: 'form-check-input',
                type: 'radio',
                id: vnode.attrs.id,
                name: vnode.attrs.name,
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

export default Radio;
