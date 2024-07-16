const Select = {
    view: (vnode) => {
        return m('div', [
            vnode.attrs.label ? m('label', { class: 'label' }, vnode.attrs.label) : null,
            m('select', {
                class: 'select',
                onchange: vnode.attrs.onchange
            }, vnode.attrs.options.map(option =>
                m('option', { value: option.value, selected: option.selected }, option.label)
            ))
        ]);
    }
};

export default Select;
