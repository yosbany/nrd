import GenericListView from '../views/GenericListView.js';
import GenericFormView from '../views/GenericFormView.js';
import GenericDeleteView from '../views/GenericDeleteView.js';

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
    },
    delete: (entity) => {
        return {
            view: (vnode) => m(GenericDeleteView, { entity, id: vnode.attrs.id })
        };
    }
};

export default GenericController;
