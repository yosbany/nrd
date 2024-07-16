import VerticalLayout from './base/VerticalLayout.js';

const GenericForm = {
    view: (vnode) => {
        const { entity, item, renderForm } = vnode.attrs;

        return m('form', {
            onsubmit: (e) => {
                e.preventDefault();
                vnode.attrs.onSubmit(item);
            }
        }, m(VerticalLayout, renderForm(item)));
    }
};

export default GenericForm;
