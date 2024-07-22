import FirebaseModel from '../models/FirebaseModel.js';
import Entities from '../config/Entities.js';
import { loadDynamicOptions } from '../utils.js';

const EntityForm = {
    oninit: vnode => {
        console.log("[Audit] Initializing EntityForm...");

        const entitySchema = Entities[vnode.attrs.entity].properties;
        vnode.state.item = {};
        vnode.state.dynamicOptions = {};
        vnode.state.errors = {};
        vnode.state.loading = true; // Estado para manejar la carga de datos

        console.log("[Audit] Initial entity schema:", entitySchema);

        // Inicializar item con valores por defecto o undefined si no hay valor por defecto
        Object.keys(entitySchema).forEach(key => {
            vnode.state.item[key] = entitySchema[key].hasOwnProperty('default') ? entitySchema[key].default : undefined;
        });

        console.log("[Audit] Initialized form item with defaults:", vnode.state.item);

        // Cargar datos dinámicos y establecer valores del formulario
        const loadOptionsAndData = async () => {
            try {
                const dynamicOptions = await loadDynamicOptions(vnode.attrs.entity, entitySchema);
                vnode.state.dynamicOptions = dynamicOptions;
                console.log("[Audit] Loaded dynamic options:", dynamicOptions);

                if (vnode.attrs.id) {
                    const data = await FirebaseModel.getById(vnode.attrs.entity, vnode.attrs.id);
                    Object.keys(entitySchema).forEach(key => {
                        if (entitySchema[key].type === "array" && !data[key]) {
                            data[key] = [];
                        }
                    });
                    vnode.state.item = { ...vnode.state.item, ...data };
                    console.log(`[Audit] Loaded existing entity data for ID ${vnode.attrs.id}:`, data);
                }

                vnode.state.loading = false;
                m.redraw();
            } catch (error) {
                console.error("[Audit] Error loading data:", error);
                vnode.state.loading = false;
                m.redraw();
            }
        };

        loadOptionsAndData();
    },
    validateForm: vnode => {
        console.log("[Audit] Validating form...");

        const entitySchema = Entities[vnode.attrs.entity].properties;
        const errors = {};

        Object.keys(entitySchema).forEach(key => {
            const property = entitySchema[key];
            const value = vnode.state.item[key];

            if (property.required) {
                if (property.inputType === "select") {
                    if (!value || value === "") {
                        errors[key] = `${property.label} es obligatorio`;
                    }
                } else if (!value) {
                    errors[key] = `${property.label} es obligatorio`;
                }
            }
            
            if (property.pattern && value) {
                const regex = new RegExp(property.pattern);
                if (!regex.test(value)) {
                    errors[key] = `${property.label} no cumple con el formato esperado`;
                }
            }
        });

        vnode.state.errors = errors;
        console.log("[Audit] Validation errors:", errors);
        return Object.keys(errors).length === 0;
    },
    handleFileChange: (vnode, key, e) => {
        console.log("[Audit] Handling file change for key:", key);

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            vnode.state.item[key] = reader.result.split(',')[1]; // Obtener la parte base64
            console.log("[Audit] File loaded and converted to base64:", vnode.state.item[key]);
            m.redraw();
        };
        reader.readAsDataURL(file);
    },
    handleAssociationLink: async (vnode, key, e) => {
        e.preventDefault();
        console.log(`[Audit] Handling association link for key: ${key}`);

        if (EntityForm.validateForm(vnode)) {
            const data = Object.keys(Entities[vnode.attrs.entity].properties).reduce((obj, key) => {
                obj[key] = vnode.state.item[key];
                return obj;
            }, {});
            
            try {
                const result = await FirebaseModel.saveOrUpdate(vnode.attrs.entity, vnode.attrs.id, data);
                vnode.attrs.id = result.id; // Actualizar el ID en los atributos del vnode
                console.log(`[Audit] Entity saved with ID: ${result.id}`);
                m.route.set(`/${vnode.attrs.entity}/${result.id}/associations/${key}`);
            } catch (error) {
                console.error("[Audit] Error saving entity:", error);
            }
        }
    },
    view: vnode => {
        if (vnode.state.loading) {
            return m("div", "Cargando...");
        }

        const entitySchema = Entities[vnode.attrs.entity].properties;
        const formFields = Object.keys(entitySchema).filter(key => entitySchema[key].showInForm);

        console.log("[Audit] Rendering form for entity:", vnode.attrs.entity);

        return m("div", [
            m("h1", `Formulario de ${Entities[vnode.attrs.entity].label}`),
            m("form", {
                onsubmit: e => {
                    e.preventDefault();
                    console.log("[Audit] Form submitted");
                    if (EntityForm.validateForm(vnode)) {
                        const data = Object.keys(entitySchema).reduce((obj, key) => {
                            obj[key] = vnode.state.item[key];
                            return obj;
                        }, {});
                        FirebaseModel.saveOrUpdate(vnode.attrs.entity, vnode.attrs.id, data).then(result => {
                            console.log("[Audit] Entity saved successfully with ID:", result.id);
                            m.route.set(`/${vnode.attrs.entity}`);
                        }).catch(error => console.error("[Audit] Error saving entity:", error));
                    }
                }
            }, [
                formFields.map(key => {
                    const property = entitySchema[key];
                    return m("div", { title: property.documentation || "" }, [
                        m("label", { 
                            class: property.required ? "required" : "", 
                            style: { fontWeight: 'bold' }
                        }, `${property.label}: `),
                        property.inputType === "text" ? m("input[type=text]", {
                            value: vnode.state.item[key] || '',
                            oninput: e => vnode.state.item[key] = e.target.value
                        }) :
                        property.inputType === "password" ? m("input[type=password]", {
                            value: vnode.state.item[key] || '',
                            oninput: e => vnode.state.item[key] = e.target.value
                        }) :
                        property.inputType === "date" ? m("input[type=date]", {
                            value: vnode.state.item[key] || '',
                            oninput: e => vnode.state.item[key] = e.target.value
                        }) :
                        property.inputType === "textarea" ? m("textarea", {
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
                            onclick: e => vnode.state.item[key] = e.target.checked,
                            style: { transform: 'scale(1.5)', marginRight: '10px' }
                        }) :
                        property.inputType === "radio" ? m("div", { style: { display: 'flex', alignItems: 'center' } }, 
                            property.options.map(option => m("div", { style: { display: 'flex', alignItems: 'center', marginRight: '10px' } }, [
                                m("input[type=radio]", {
                                    name: key,
                                    value: option,
                                    checked: vnode.state.item[key] === option,
                                    onclick: e => vnode.state.item[key] = e.target.value,
                                    style: { transform: 'scale(1.5)', marginRight: '5px', marginBottom: '10px' }
                                }),
                                m("label", option)
                            ]))
                        ) :
                        property.inputType === "link" ? m("a", {
                            href: "#",
                            class: "association-link",
                            onclick: e => EntityForm.handleAssociationLink(vnode, key, e)
                        }, `Asociar ${property.label}`) :
                        property.inputType === "file" ? [
                            m("input[type=file]", {
                                onchange: e => EntityForm.handleFileChange(vnode, key, e)
                            }),
                            vnode.state.item[key] ? m("img", {
                                src: `data:image/*;base64,${vnode.state.item[key]}`,
                                style: { width: '100px', height: '100px', display: 'block', marginTop: '10px' }
                            }) : null
                        ] : null,
                        vnode.state.errors[key] ? m("div.error", vnode.state.errors[key]) : null
                    ]);
                }),
                m("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' } }, [
                    m("button.cancel-button", {
                        type: "button",
                        onclick: () => {
                            console.log("[Audit] Cancel button clicked");
                            m.route.set(`/${vnode.attrs.entity}`);
                        },
                        style: { backgroundColor: 'gray' }
                    }, "Cancelar"),
                    m("button[type=submit]", { style: { backgroundColor: 'royalblue' } }, "Guardar")
                ])
            ])
        ]);
    }
};

export default EntityForm;
