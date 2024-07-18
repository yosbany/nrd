import FirebaseModel from '../models/FirebaseModel.js';
import Entities from '../config/Entities.js';
import { loadDynamicOptions } from '../utils.js';

const EntityForm = {
    oninit: vnode => {
        const entitySchema = Entities[vnode.attrs.entity].properties;
        vnode.state.item = {};
        vnode.state.dynamicOptions = {};
        vnode.state.errors = {};
        vnode.state.loading = true; // Estado para manejar la carga de datos

        // Inicializar item con valores por defecto o undefined si no hay valor por defecto
        Object.keys(entitySchema).forEach(key => {
            vnode.state.item[key] = entitySchema[key].hasOwnProperty('default') ? entitySchema[key].default : undefined;
        });

        // Cargar datos dinámicos y establecer valores del formulario
        const loadOptionsAndData = async () => {
            try {
                const dynamicOptions = await loadDynamicOptions(vnode.attrs.entity, entitySchema);
                vnode.state.dynamicOptions = dynamicOptions;
                if (vnode.attrs.id) {
                    const data = await FirebaseModel.getById(vnode.attrs.entity, vnode.attrs.id);
                    Object.keys(entitySchema).forEach(key => {
                        if (entitySchema[key].type === "array" && !data[key]) {
                            data[key] = [];
                        }
                    });
                    vnode.state.item = { ...vnode.state.item, ...data };
                }
                vnode.state.loading = false;
                m.redraw();
            } catch (error) {
                console.error("Error loading data:", error);
                vnode.state.loading = false;
                m.redraw();
            }
        };

        loadOptionsAndData();
    },
    validateForm: vnode => {
        const entitySchema = Entities[vnode.attrs.entity].properties;
        const errors = {};

        Object.keys(entitySchema).forEach(key => {
            const property = entitySchema[key];
            if (property.required && !vnode.state.item[key]) {
                errors[key] = `${property.label} es obligatorio`;
            }
        });

        vnode.state.errors = errors;
        return Object.keys(errors).length === 0;
    },
    view: vnode => {
        if (vnode.state.loading) {
            return m("div", "Cargando...");
        }

        const entitySchema = Entities[vnode.attrs.entity].properties;
        const formFields = Object.keys(entitySchema).filter(key => entitySchema[key].showInForm);
        return m("div", [
            m("h1", `Formulario de ${Entities[vnode.attrs.entity].label}`),
            m("form", {
                onsubmit: e => {
                    e.preventDefault();
                    if (EntityForm.validateForm(vnode)) {
                        const data = Object.keys(entitySchema).reduce((obj, key) => {
                            obj[key] = vnode.state.item[key];
                            return obj;
                        }, {});
                        FirebaseModel.saveOrUpdate(vnode.attrs.entity, vnode.attrs.id, data).then(() => {
                            m.route.set(`/${vnode.attrs.entity}`);
                        });
                    }
                }
            }, [
                formFields.map(key => {
                    const property = entitySchema[key];
                    return m("div", [
                        m("label", { 
                            class: property.required ? "required" : "" 
                        }, `${property.label}: `),
                        property.inputType === "text" ? m("input[type=text]", {
                            value: vnode.state.item[key] || '',
                            oninput: e => vnode.state.item[key] = e.target.value
                        }) :
                        property.inputType === "number" ? m("input[type=number]", {
                            value: vnode.state.item[key] || 0,
                            oninput: e => vnode.state.item[key] = parseFloat(e.target.value)
                        }) :
                        property.inputType === "select" ? m("select", {
                            value: vnode.state.item[key] || '',
                            onchange: e => vnode.state.item[key] = e.target.value
                        }, [
                            m("option", { value: "" }, "Seleccione..."),
                            vnode.state.dynamicOptions[key] ?
                            vnode.state.dynamicOptions[key].map(option =>
                                m("option", { value: option.value }, option.label)
                            ) :
                            property.options.map(option =>
                                m("option", { value: option }, option)
                            )
                        ]) :
                        property.inputType === "checkbox" ? m("input[type=checkbox]", {
                            checked: vnode.state.item[key] || false,
                            onclick: e => vnode.state.item[key] = e.target.checked
                        }) :
                        property.inputType === "link" ? m("a", {
                            href: `/${vnode.attrs.entity}/${vnode.attrs.id}/associations/${key}`,
                            onclick: e => {
                                e.preventDefault();
                                m.route.set(`/${vnode.attrs.entity}/${vnode.attrs.id}/associations/${key}`);
                            }
                        }, `Asociar ${property.label}`) : null,
                        vnode.state.errors[key] ? m("div.error", vnode.state.errors[key]) : null
                    ]);
                }),
                m("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' } }, [
                    m("button[type=submit]", { style: { backgroundColor: 'royalblue' } }, "Guardar"),
                    m("button.cancel-button", {
                        type: "button",
                        onclick: () => m.route.set(`/${vnode.attrs.entity}`),
                        style: { backgroundColor: 'gray' }
                    }, "Cancelar")
                ])
            ])
        ]);
    }
};

export default EntityForm;
