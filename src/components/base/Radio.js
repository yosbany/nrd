const Radio = {
    view: (vnode) => {
        return m('div', { class: 'radio' }, [
            m('label', [
                m('input[type=radio]', {
                    name: vnode.attrs.name,
                    checked: vnode.attrs.checked,
                    onchange: vnode.attrs.onchange
                }),
                vnode.attrs.label
            ])
        ]);
    }
};

export default Radio;
