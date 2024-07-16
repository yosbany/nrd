const Checkbox = {
    view: (vnode) => {
        return m('div', { class: 'checkbox' }, [
            m('label', [
                m('input[type=checkbox]', {
                    checked: vnode.attrs.checked,
                    onchange: vnode.attrs.onchange
                }),
                vnode.attrs.label
            ])
        ]);
    }
};

export default Checkbox;
