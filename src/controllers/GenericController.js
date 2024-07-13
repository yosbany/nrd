import GenericListView from '../views/GenericListView.js';
import GenericFormView from '../views/GenericFormView.js';

const GenericController = {
    list: (entity, renderItem) => {
        return {
            view: () => m(GenericListView, { entity, renderItem })
        };
    },
    form: (entity, renderForm) => {
        return {
            view: (vnode) => m(GenericFormView, { entity, renderForm, id: vnode.attrs.id })
        };
    }
};

export default GenericController;
