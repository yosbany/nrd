const GenericForm = {
    view: (vnode) => {
        const { entity, item, renderForm } = vnode.attrs;
        return m('form', {
            onsubmit: (e) => {
                e.preventDefault();
                vnode.attrs.onSubmit(item);
            }
        }, renderForm(item));
    }
};

export default GenericForm;
