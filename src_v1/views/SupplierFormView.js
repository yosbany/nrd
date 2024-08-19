import FirebaseModel from '../models/FirebaseModel.js';
import ValidationModel from '../models/ValidationModel.js';
import Breadcrumb from '../components/base/Breadcrumb.js';
import Fila from '../components/base/Fila.js';
import Column from '../components/base/Column.js';
import Button from '../components/base/Button.js';
import Card from '../components/base/Card.js';
import Text from '../components/base/Text.js';
import { decodeId } from '../utils.js';

const SupplierFormView = {
    oninit: async vnode => {
        vnode.state.item = {};
        vnode.state.errors = {};
        vnode.state.id = decodeId(vnode.attrs.id);  

        if (vnode.attrs.id) {
            try {
                const data = await FirebaseModel.getById(vnode.state.id, false);
                vnode.state.item = { ...data };
                m.redraw();
            } catch (error) {
                console.error("[Audit][SupplierFormView] Error loading data:", error);
                m.redraw();
            }
        }
    },

    validateForm: vnode => {
        // Asegurarse de agregar el prefijo +598 antes de la validación
        if (vnode.state.item.phone) {
            vnode.state.item.phone = `+598${vnode.state.item.phone}`;
        }
        
        const errors = ValidationModel.validateEntityData(vnode.state.item, 'Suppliers');
        vnode.state.errors = errors;
        return Object.keys(errors).length === 0;
    },

    handleSubmit: async (e, vnode) => {
        e.preventDefault();
        if (SupplierFormView.validateForm(vnode)) {
            try {
                await FirebaseModel.saveOrUpdate('Suppliers', vnode.state.id, vnode.state.item);
                m.route.set('/suppliers');
            } catch (error) {
                vnode.state.errors = { save: error.message };
                m.redraw();
            }
        } else {
            m.redraw();
        }
    },

    formatPhoneNumber: phone => {
        // Elimina el prefijo +598 para formatear correctamente
        const rawPhone = phone.replace(/^\+598/, '');
        return `+598 ${rawPhone.slice(0, 2)} ${rawPhone.slice(2, 5)} ${rawPhone.slice(5)}`;
    },

    view: vnode => {
        const item = vnode.state.item;
        const errors = vnode.state.errors;

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Proveedores", path: "/suppliers" },
            { name: vnode.state.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: "Proveedor", useCustomPadding: false }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    m("form.uk-form-stacked", {
                        onsubmit: e => SupplierFormView.handleSubmit(e, vnode)
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
                                value: item.phone ? SupplierFormView.formatPhoneNumber(item.phone) : "", // Formatear el número para mostrarlo
                                onInput: value => item.phone = value.replace(/\D/g, ''), // Guardar sin formato
                                error: errors.phone,
                                placeholder: "Ingrese un celular uruguayo de 8 dígitos"
                            })
                        ]),
                        m(Fila, { gap: 'small', class: 'uk-flex uk-flex-right' }, [
                            m(Column, { width: 'auto' }, [
                                m(Button, {
                                    type: 'primary',
                                    label: 'Guardar',
                                    onClick: e => SupplierFormView.handleSubmit(e, vnode)
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
