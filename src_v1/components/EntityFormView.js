import FirebaseModel from '../models/FirebaseModel.js';
import Entities from '../config/Entities.js';
import ValidationModel from '../models/ValidationModel.js';
import { getComponentEntityProperty } from '../utils.js';
import Breadcrumb from './base/Breadcrumb.js';
import Fila from './base/Fila.js';
import Column from './base/Column.js';
import Button from './base/Button.js';
import Card from './base/Card.js';

const EntityFormView = {
    oninit: vnode => {
        console.log("[Audit][EntityFormView] Initializing for entity:", vnode.attrs.entity);

        vnode.state.item = {};
        vnode.state.errors = {};

        if (vnode.attrs.id) {
            FirebaseModel.getById(vnode.attrs.entity, vnode.attrs.id)
                .then(data => {
                    vnode.state.item = { ...data };
                    m.redraw();
                })
                .catch(error => {
                    console.error("[Audit][EntityFormView] Error loading data:", error);
                    m.redraw();
                });
        }
    },

    validateForm: vnode => {
        console.log("[Audit][EntityFormView] Validating form...");
        console.log("[Audit][EntityFormView] Current item state:", vnode.state.item);
    
        const propertiesSchema = Entities[vnode.attrs.entity]?.properties || {};
        const errors = ValidationModel.validateEntityData(vnode.state.item, propertiesSchema);
    
        console.log("[Audit][EntityFormView] Validation errors:", errors);
    
        vnode.state.errors = errors;
        return Object.keys(errors).length === 0;
    },

    handleSubmit: (e, vnode) => {
        e.preventDefault();
        const entity = vnode.attrs.entity;
    
        console.log("[Audit][EntityFormView] Submitting form for entity:", entity);
    
        if (EntityFormView.validateForm(vnode)) {
            console.log("[Audit][EntityFormView] Form is valid. Proceeding to save data...");
            const propertiesSchema = Entities[entity]?.properties || {};
            const data = Object.keys(propertiesSchema).reduce((obj, key) => {
                // Asignar un valor por defecto o asegurar que no haya undefined
                obj[key] = vnode.state.item[key] !== undefined ? vnode.state.item[key] : null;
                return obj;
            }, {});
    
            console.log("[Audit][EntityFormView] Data to save:", data);
    
            FirebaseModel.saveOrUpdate(entity, vnode.attrs.id, data)
                .then(() => {
                    console.log("[Audit][EntityFormView] Data saved successfully. Redirecting...");
                    m.route.set(`/${entity}`);
                })
                .catch(error => {
                    console.error("[Audit][EntityFormView] Error saving entity:", error);
                });
        } else {
            console.warn("[Audit][EntityFormView] Form validation failed. Errors:", vnode.state.errors);
        }
    },

    renderField: (propertiesSchema, key, item, errors, vnode) => {
        if (!propertiesSchema[key]) {
            console.error("[Audit][EntityFormView] Invalid property");
            return m("span", "Invalid property");
        }

        let value = item[key];
        const onInput = newValue => {
            item[key] = newValue;
        };

        return getComponentEntityProperty(propertiesSchema[key], value, onInput, errors[key]);
    },

    view: vnode => {
        const propertiesSchema = Entities[vnode.attrs.entity]?.properties || {};
        const item = vnode.state.item;
        const errors = vnode.state.errors;
        const { entity, outputMode = false } = vnode.attrs;
        const formFields = Object.keys(propertiesSchema).filter(key => propertiesSchema[key].showInForm);

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: Entities[entity].label, path: `/${entity}` },
            { name: vnode.attrs.id ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: `Formulario de ${Entities[entity]?.label || 'Entidad'}`, useCustomPadding: false }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    m("form.uk-form-stacked", {
                        onsubmit: e => EntityFormView.handleSubmit(e, vnode)
                    }, [
                        formFields.map(key => m("div.uk-margin", { key }, [
                            EntityFormView.renderField(propertiesSchema, key, item, errors, vnode)
                        ])),
                        m(Fila, { gap: 'small', class: 'uk-flex uk-flex-right' }, [
                            m(Column, { width: 'auto' }, [
                                m(Button, {
                                    type: 'primary',
                                    label: 'Guardar',
                                    disabled: Object.keys(errors).length > 0,
                                    onClick: e => EntityFormView.handleSubmit(e, vnode)
                                })
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    }
};

export default EntityFormView;
