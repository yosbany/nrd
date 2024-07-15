const Checkbox = {
    view: (vnode) => {
        const labelPosition = vnode.attrs.labelPosition || 'left';
        return m('div', { class: 'form-check' }, [
            labelPosition === 'left' && m('label', { class: 'form-check-label me-2' }, vnode.attrs.label),
            m('input', {
                class: 'form-check-input',
                type: 'checkbox',
                checked: vnode.attrs.checked,
                onchange: (e) => vnode.attrs.onchange(e.target.checked)
            }),
            labelPosition === 'top' && m('label', { class: 'form-check-label ms-2' }, vnode.attrs.label)
        ]);
    }
};

export default Checkbox;
