const Select = {
    view: (vnode) => {
        return m('div', { class: 'mb-3' }, [
            vnode.attrs.label && m('label', { class: 'form-label' }, vnode.attrs.label),
            m('select', {
                class: 'form-select',
                value: vnode.attrs.value,
                onchange: vnode.attrs.onchange
            }, vnode.attrs.options.map(option => 
                m('option', { value: option.value }, option.label)
            ))
        ]);
    }
};

export default Select;
