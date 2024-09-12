import UserListController from '../controllers/UserListController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Button from '../../core/ui/Button.js';
import Card from '../../core/ui/Card.js';
import Text from '../../core/ui/Text.js';
import TextInput from '../../core/ui/Text.js';
import Table from '../../core/ui/Table.js';
import LoadingSpinner from '../views/partials/Loading.js';
import { encodeId } from '../utils/Helpers.js';

const UserListView = {
    oninit: vnode => {
        UserListController.oninit;
    },

    view: vnode => {
        const filteredItems = UserListController.filterItems(vnode);

        return [
            m(LoadingSpinner, { loading: vnode.state.loading }), 
            m(Card, { title: "Usuarios", useCustomPadding: true }, [
                m(Breadcrumb, { items: [{ name: "Inicio", path: "/" }, { name: "Usuarios", path: "/users" }] }),
                m(Fila, { gap: 'medium' }, [
                    m(Column, { width: 'expand' }, [
                        m(TextInput, {
                            value: vnode.state.searchText,
                            onInput: value => vnode.state.searchText = value,
                            placeholder: "Buscar...",
                            showLabel: false
                        })
                    ]),
                    m(Column, { width: 'auto' }, [
                        m(Button, {
                            type: "primary",
                            label: "Nuevo",
                            onClick: () => m.route.set('/users/new')
                        })
                    ])
                ]),
                m(Table, {
                    bind: filteredItems,
                    onEdit: id => m.route.set(`/users/${encodeId(id)}`),
                    onDelete: id => UserListController.onDelete(vnode, id)
                }, [
                    m(Text, { label: "Nombre Completo", value: "bind.fullName" }),
                    m(Text, { label: "Correo", value: "bind.email" }),
                    m(Text, { label: "Rol", value: "bind.role" })
                ]),
                filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
            ])
        ];
    }
};

export default UserListView;
