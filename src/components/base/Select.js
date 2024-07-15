const Select = {
    view: (vnode) => {
        const labelPosition = vnode.attrs.labelPosition || 'top';
        return m('div', { class: 'mb-3' }, [
            labelPosition === 'top' && m('label', { class: 'form-label' }, vnode.attrs.label),
            m('div', { class: labelPosition === 'left' ? 'd-flex align-items-center' : '' }, [
                labelPosition === 'left' && m('label', { class: 'form-label me-2' }, vnode.attrs.label),
                m('select', {
                    class: 'form-select',
                    value: vnode.attrs.value,
                    onchange: (e) => vnode.attrs.onchange(e.target.value)
                }, [
                    vnode.attrs.options.map(option =>
                        m('option', { value: option.value }, option.label)
                    )
                ])
            ])
        ]);
    }
};

export default Select;
