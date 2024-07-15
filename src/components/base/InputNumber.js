const InputNumber = {
    view: (vnode) => {
        const labelPosition = vnode.attrs.labelPosition || 'top';
        return m('div', { class: 'mb-3' }, [
            labelPosition === 'top' && m('label', { class: 'form-label' }, vnode.attrs.label),
            m('div', { class: labelPosition === 'left' ? 'd-flex align-items-center' : '' }, [
                labelPosition === 'left' && m('label', { class: 'form-label me-2' }, vnode.attrs.label),
                m('input', {
                    class: 'form-control',
                    type: 'number',
                    value: vnode.attrs.value,
                    placeholder: vnode.attrs.placeholder || '',
                    onchange: (e) => vnode.attrs.onchange(e.target.value)
                })
            ])
        ]);
    }
};

export default InputNumber;
