import SupplierFormController from '../controllers/SupplierFormController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Button from '../../core/ui/Button.js';
import Card from '../../core/ui/Card.js';
import Text from '../../core/ui/Text.js';

const SupplierFormView = {
    oninit: SupplierFormController.oninit,

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Proveedores", path: "/suppliers" },
            { name: vnode.state.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: "Proveedor", useCustomPadding: true }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    m("form.uk-form-stacked", {
                        onsubmit: e => SupplierFormController.handleSubmit(e, vnode)
                    }, [
                        m("div.uk-margin", [
                            m(Text, {
                                label: "Nombre Comercial",
                                value: item.tradeName || "",
                                onInput: value => item.tradeName = value,
                                error: errors.tradeName
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Text, {
                                label: "Razón Social",
                                value: item.businessName || "",
                                onInput: value => item.businessName = value,
                                error: errors.businessName
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Text, {
                                label: "RUT",
                                value: item.rut || "",
                                onInput: value => item.rut = value,
                                error: errors.rut
                            })
                        ]),
                        m("div.uk-margin", [
                            m(Text, {
                                label: "Celular",
                                value: item.phone || "",
                                onInput: value => item.phone = value.replace(/\D/g, ''),
                                error: errors.phone,
                                placeholder: "Ingrese un celular uruguayo de 8 dígitos"
                            })
                        ]),
                        m(Fila, { gap: 'small', class: 'uk-flex uk-flex-right' }, [
                            m(Column, { width: 'auto' }, [
                                m(Button, {
                                    type: 'primary',
                                    label: 'Guardar',
                                    onClick: e => SupplierFormController.handleSubmit(e, vnode)
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

export default SupplierFormView;
