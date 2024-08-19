import FirebaseModel from '../models/FirebaseModel.js';
import ValidationModel from '../models/ValidationModel.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import Fila from '../components/base/Fila.js';
import Column from '../components/base/Column.js';
import Button from '../components/base/Button.js';
import Card from '../components/base/Card.js';
import Text from '../components/base/Text.js';
import Select from '../components/base/Select.js';
import { decodeId } from '../utils.js';

const UserFormView = {
    oninit: vnode => {
        vnode.state.item = {};
        vnode.state.errors = {};
        vnode.state.id = decodeId(vnode.attrs.id); 

        if (vnode.state.id) {
            FirebaseModel.getById(vnode.state.id, false)
                .then(data => {
                    vnode.state.item = { ...data };
                    m.redraw();
                })
                .catch(error => {
                    console.error("[Audit][UserFormView] Error loading data:", error);
                    m.redraw();
                });
        }
    },

    validateForm: vnode => {
        const errors = ValidationModel.validateEntityData(vnode.state.item, 'Users');
        vnode.state.errors = errors;
        return Object.keys(errors).length === 0;
    },

    handleSubmit: async (e, vnode) => {
        e.preventDefault();
        if (UserFormView.validateForm(vnode)) {
            try {
                await FirebaseModel.saveOrUpdate('Users', vnode.state.id, vnode.state.item);
                m.route.set('/users');
            } catch (error) {
                vnode.state.errors = { save: error.message };
                m.redraw();
            }
        } else {
            m.redraw();
        }
    },

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Usuarios", path: "/users" },
            { name: vnode.state.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: "Usuario", useCustomPadding: false }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    m("form.uk-form-stacked", {
                        onsubmit: e => UserFormView.handleSubmit(e, vnode)
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
                                    onclick: e => UserFormView.handleSubmit(e, vnode)
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
