import FirebaseModel from '../models/FirebaseModel.js';
import Entities from '../config/Entities.js';
import { loadDynamicOptions } from '../utils.js';

const AssociationManager = {
    oninit: vnode => {
        console.log("[Audit] Initializing AssociationManager...");
        
        vnode.state.associatedItems = [];
        vnode.state.allItems = [];
        vnode.state.selectedItem = null;
        vnode.state.dynamicOptions = {};

        const parentEntity = vnode.attrs.entity;
        const parentId = vnode.attrs.id;
        const associationProperty = vnode.attrs.associationProperty;

        console.log(`[Audit] Parent Entity: ${parentEntity}, Parent ID: ${parentId}, Association Property: ${associationProperty}`);

        // Determinar la entidad hija basada en la propiedad de asociación
        const childEntity = Entities[parentEntity].properties[associationProperty].linkTo;

        console.log(`[Audit] Child Entity: ${childEntity}`);

        // Obtener todos los elementos de la entidad hija
        FirebaseModel.getAll(childEntity).then(data => {
            console.log("[Audit] Fetched all items from child entity:", data);
            vnode.state.allItems = data;
            loadDynamicOptions(parentEntity, Entities[parentEntity].properties).then(dynamicOptions => {
                vnode.state.dynamicOptions = dynamicOptions;
                console.log("[Audit] Loaded dynamic options:", dynamicOptions);
                if (parentId) {
                    // Obtener el elemento de la entidad padre
                    FirebaseModel.getById(parentEntity, parentId).then(parentData => {
                        console.log(`[Audit] Fetched parent entity data:`, parentData);
                        vnode.state.parentData = parentData;
                        vnode.state.associatedItems = parentData[associationProperty] || [];
                        m.redraw();
                    }).catch(error => console.error("[Audit] Error fetching parent entity data:", error));
                }
            }).catch(error => console.error("[Audit] Error loading dynamic options:", error));
        }).catch(error => console.error("[Audit] Error fetching all items from child entity:", error));
    },
    addAssociation: vnode => {
        console.log("[Audit] Adding association...");
        if (vnode.state.selectedItem) {
            console.log(`[Audit] Selected item: ${vnode.state.selectedItem.id}`);
            vnode.state.associatedItems.push(vnode.state.selectedItem.id); // Solo guardar el ID
            vnode.state.selectedItem = null; // Limpiar la selección después de agregar
            AssociationManager.saveAssociations(vnode);
        } else {
            console.warn("[Audit] No item selected to add.");
        }
    },
    removeAssociation: vnode => {
        console.log("[Audit] Removing association...");
        if (vnode.state.selectedItem) {
            console.log(`[Audit] Selected item to remove: ${vnode.state.selectedItem.id}`);
            vnode.state.associatedItems = vnode.state.associatedItems.filter(id => id !== vnode.state.selectedItem.id);
            AssociationManager.saveAssociations(vnode);
        } else {
            console.warn("[Audit] No item selected to remove.");
        }
    },
    saveAssociations: vnode => {
        console.log("[Audit] Saving associations...");
        const parentEntity = vnode.attrs.entity;
        const parentId = vnode.attrs.id;
        const associationProperty = vnode.attrs.associationProperty;

        // Obtener la entidad padre completa
        FirebaseModel.getById(parentEntity, parentId).then(parentData => {
            console.log("[Audit] Fetched parent entity data for saving associations:", parentData);

            // Actualizar solo la propiedad de asociación
            parentData[associationProperty] = vnode.state.associatedItems;

            // Guardar el objeto completo actualizado
            FirebaseModel.saveOrUpdate(parentEntity, parentId, parentData).then(() => {
                console.log("[Audit] Associations saved successfully.");
                m.redraw();
            }).catch(error => console.error("[Audit] Error saving associations:", error));
        }).catch(error => console.error("[Audit] Error fetching parent entity data for saving associations:", error));
    },
    view: vnode => {
        const parentEntity = vnode.attrs.entity;
        const parentData = vnode.state.parentData || {};
        const parentSchema = Entities[parentEntity].properties;
        const associationProperty = vnode.attrs.associationProperty;
        const childEntity = Entities[parentEntity].properties[associationProperty].linkTo;
        const childSchema = Entities[childEntity].properties;
        const tableHeaders = Object.keys(childSchema).filter(key => childSchema[key].showInTable);

        console.log(`[Audit] Rendering view for AssociationManager with Parent Entity: ${parentEntity}, Child Entity: ${childEntity}`);

        // Filtrar los elementos que ya están asociados
        const availableItems = vnode.state.allItems.filter(item => !vnode.state.associatedItems.includes(item.id));

        return m("div", [
            m("h2", `Gestionar ${Entities[childEntity].label}`),
            m("div", [
                m("h3", `Propiedades de ${Entities[parentEntity].label}`),
                m("table", [
                    m("tbody", 
                        Object.keys(parentSchema).filter(key => parentSchema[key].showInTable).map(key => 
                            m("tr", [
                                m("th", parentSchema[key].label),
                                m("td", vnode.state.dynamicOptions[key] 
                                    ? vnode.state.dynamicOptions[key].find(opt => opt.value === parentData[key])?.label || parentData[key] 
                                    : parentData[key])
                            ])
                        )
                    )
                ])
            ]),
            m("div", [
                m("h3", `Agregar ${Entities[childEntity].label}`),
                m("div", { class: 'association-form' }, [
                    m("select", {
                        onchange: e => {
                            vnode.state.selectedItem = availableItems.find(i => i.id === e.target.value);
                            console.log(`[Audit] Selected item for association: ${vnode.state.selectedItem ? vnode.state.selectedItem.id : 'None'}`);
                        },
                        disabled: availableItems.length === 0 // Deshabilitar el select si no hay elementos disponibles
                    }, [
                        m("option", { value: "" }, "Seleccione una opción"),
                        availableItems.map(item => 
                            m("option", { value: item.id }, item.name)
                        )
                    ]),
                    m("button", { 
                        onclick: () => AssociationManager.addAssociation(vnode),
                        disabled: !vnode.state.selectedItem || availableItems.length === 0 // Deshabilitar botón si no hay selección o no hay elementos disponibles
                    }, "Agregar")
                ])
            ]),
            m("table", [
                m("thead", [
                    m("tr", [
                        ...tableHeaders.map(key => m("th", childSchema[key].label)),
                        m("th", "")
                    ])
                ]),
                m("tbody", vnode.state.associatedItems.map(itemId => {
                    const item = vnode.state.allItems.find(i => i.id === itemId);
                    return m("tr", { key: itemId }, [
                        ...tableHeaders.map(key => m("td", item[key])),
                        m("td", { style: { textAlign: 'right', width: '100px' } }, [
                            m("button", { onclick: () => {
                                vnode.state.selectedItem = { id: itemId };
                                console.log(`[Audit] Selected item to remove: ${itemId}`);
                                AssociationManager.removeAssociation(vnode);
                            } }, "Eliminar")
                        ])
                    ]);
                }))
            ]),
            m("hr"),
            m("button", {
                onclick: () => m.route.set(`/${vnode.attrs.entity}/${vnode.attrs.id}`)
            }, "Regresar")
        ]);
    }
};

export default AssociationManager;
