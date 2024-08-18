import FirebaseModel from '../models/FirebaseModel.js';
import Table from '../components/base/Table.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import TextInput from '../components/base/Text.js';
import Button from '../components/base/Button.js';
import Fila from '../components/base/Fila.js';
import Column from '../components/base/Column.js';
import Card from '../components/base/Card.js';
import Text from '../components/base/Text.js';
import { encodeId } from '../utils.js';

const UserList = {
    oninit: vnode => {
        vnode.state.searchText = '';
        vnode.state.users = [];
        vnode.state.loading = true;

        UserList.loadUsers(vnode);
    },

    loadUsers: vnode => {
        FirebaseModel.getAll('Users')
            .then(data => {
                vnode.state.users = data;
                vnode.state.loading = false;
                m.redraw();
            })
            .catch(error => {
                console.error("[Audit][UserList] Error loading users:", error);
                vnode.state.loading = false;
                m.redraw();
            });
    },

    filterItems: vnode => {
        if (!vnode.state.searchText) return vnode.state.users;
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.users.filter(user =>
            Object.values(user).some(value =>
                value && value.toString().toLowerCase().includes(searchText)
            )
        );
    },

    onEdit: id => {
        m.route.set(`/users/${encodeId(id)}`);
    },

    onDelete: (vnode, id) => {
        FirebaseModel.delete('Users', id)
            .then(() => {
                UserList.loadUsers(vnode);
            })
            .catch(error => console.error("[Audit][UserList] Error deleting user:", error));
    },

    view: vnode => {
        if (vnode.state.loading) {
            return m("div.uk-text-center", "Cargando...");
        }

        const filteredItems = UserList.filterItems(vnode);

        return m(Card, { title: "Listado de Usuarios", useCustomPadding: false }, [
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
                onEdit: id => UserList.onEdit(id),
                onDelete: id => UserList.onDelete(vnode, id)
            }, [
                m(Text, { label: "Nombre Completo", value: "bind.fullName" }),
                m(Text, { label: "Correo", value: "bind.email" }),
                m(Text, { label: "Rol", value: "bind.role" })
            ]),
            filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
        ]);
    }
};

export default UserList;
