import FirebaseModel from '../models/FirebaseModel.js';
import Entities from '../config/Entities.js';
import { loadDynamicOptions } from '../utils.js';

const AssociationManager = {
    oninit: vnode => {
        vnode.state.associatedItems = [];
        vnode.state.allItems = [];
        vnode.state.selectedItem = null;
        vnode.state.dynamicOptions = {};

        const parentEntity = vnode.attrs.entity;
        const parentId = vnode.attrs.id;
        const associationProperty = vnode.attrs.associationProperty;

        // Determinar la entidad hija basada en la propiedad de asociación
        const childEntity = Entities[parentEntity].properties[associationProperty].linkTo;

        // Obtener todos los elementos de la entidad hija
        FirebaseModel.getAll(childEntity).then(data => {
            vnode.state.allItems = data;
            loadDynamicOptions(parentEntity, Entities[parentEntity].properties).then(dynamicOptions => {
                vnode.state.dynamicOptions = dynamicOptions;
                if (parentId) {
                    // Obtener el elemento de la entidad padre
                    FirebaseModel.getById(parentEntity, parentId).then(parentData => {
                        vnode.state.parentData = parentData;
                        vnode.state.associatedItems = parentData[associationProperty] || [];
                        m.redraw();
                    });
                }
            });
        });
    },
    addAssociation: vnode => {
        if (vnode.state.selectedItem) {
            vnode.state.associatedItems.push(vnode.state.selectedItem.id); // Solo guardar el ID
            vnode.state.selectedItem = null; // Limpiar la selección después de agregar
            AssociationManager.saveAssociations(vnode);
        }
    },
    removeAssociation: vnode => {
        vnode.state.associatedItems = vnode.state.associatedItems.filter(id => id !== vnode.state.selectedItem.id);
        AssociationManager.saveAssociations(vnode);
    },
    saveAssociations: vnode => {
        const parentEntity = vnode.attrs.entity;
        const parentId = vnode.attrs.id;
        const associationProperty = vnode.attrs.associationProperty;

        // Obtener la entidad padre completa
        FirebaseModel.getById(parentEntity, parentId).then(parentData => {
            // Actualizar solo la propiedad de asociación
            parentData[associationProperty] = vnode.state.associatedItems;

            // Guardar el objeto completo actualizado
            FirebaseModel.saveOrUpdate(parentEntity, parentId, parentData).then(() => {
                m.redraw();
            });
        });
    },
    view: vnode => {
        const parentEntity = vnode.attrs.entity;
        const parentData = vnode.state.parentData || {};
        const parentSchema = Entities[parentEntity].properties;
        const associationProperty = vnode.attrs.associationProperty;
        const childEntity = Entities[parentEntity].properties[associationProperty].linkTo;
        const childSchema = Entities[childEntity].properties;
        const tableHeaders = Object.keys(childSchema).filter(key => childSchema[key].showInTable);

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
                m("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, [
                    m("select", {
                        onchange: e => {
                            vnode.state.selectedItem = availableItems.find(i => i.id === e.target.value);
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
