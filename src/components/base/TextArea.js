const TextArea = {
    view: (vnode) => {
        const labelPosition = vnode.attrs.labelPosition || 'top';
        return m('div', { class: 'mb-3' }, [
            labelPosition === 'top' && m('label', { class: 'form-label' }, vnode.attrs.label),
            m('div', { class: labelPosition === 'left' ? 'd-flex align-items-center' : '' }, [
                labelPosition === 'left' && m('label', { class: 'form-label me-2' }, vnode.attrs.label),
                m('textarea', {
                    class: 'form-control',
                    value: vnode.attrs.value,
                    placeholder: vnode.attrs.placeholder || '',
                    rows: vnode.attrs.rows || 3,
                    onchange: (e) => vnode.attrs.onchange(e.target.value)
                })
            ])
        ]);
    }
};

export default TextArea;
