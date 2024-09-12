import UserFormController from '../controllers/UserFormController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Button from '../../core/ui/Button.js';
import Card from '../../core/ui/Card.js';
import Text from '../../core/ui/Text.js';
import Select from '../../core/ui/Select.js';

const UserFormView = {
    oninit: UserFormController.oninit,

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Usuarios", path: "/users" },
            { name: vnode.state.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: "Usuario", useCustomPadding: true }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    m("form.uk-form-stacked", {
                        onsubmit: e => UserFormController.handleSubmit(e, vnode)
                    }, [
                        m("div.uk-margin", [
                            m(Text, {
                                label: "Nombre Completo",
                                value: item.fullName || "",
                                onInput: value => item.fullName = value,
                                error: errors.fullName
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Text, {
                                label: "Email",
                                value: item.email || "",
                                onInput: value => item.email = value,
                                error: errors.email
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Select, {
                                label: "Rol",
                                options: ["Admin", "User"],
                                value: item.role || "User",
                                onChange: value => item.role = value,
                                error: errors.role
                            })
                        ]),
                        m(Fila, { gap: 'small', class: 'uk-flex uk-flex-right' }, [
                            m(Column, { width: 'auto' }, [
                                m(Button, {
                                    type: 'primary',
                                    label: 'Guardar',
                                    onclick: e => UserFormController.handleSubmit(e, vnode)
                                })
                            ])
                        ]),
                        errors.save ? m("div.uk-alert-danger", { class: "uk-margin-top" }, errors.save) : null
                    ])
                ])
            ])
        ]);
    }
};

export default UserFormView;
