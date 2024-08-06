import FirebaseModel from '../models/FirebaseModel.js';
import Entities from '../config/Entities.js';
import { getComponentEntityProperty } from '../utils.js';
import Breadcrumb from './base/Breadcrumb.js';
import TableOutput from './base/TableOutput.js';

const AssociationManagerView = {
    oninit: vnode => {
        vnode.state.associatedItems = [];
        vnode.state.allItems = [];
        vnode.state.selectedItem = null;
        vnode.state.refData = {};
        vnode.state.parentData = {};

        const parentEntity = vnode.attrs.entity;
        const parentId = vnode.attrs.id;
        const associationProperty = vnode.attrs.associationProperty;
        const childEntity = Entities[parentEntity].properties[associationProperty].linkTo;

        FirebaseModel.getAll(childEntity).then(data => {
            vnode.state.allItems = data;

            if (parentId) {
                FirebaseModel.getById(parentEntity, parentId).then(parentData => {
                    vnode.state.parentData = parentData;
                    vnode.state.associatedItems = parentData[associationProperty] || [];

                    const linkedEntityPromises = vnode.state.associatedItems.map(itemId =>
                        FirebaseModel.getById(childEntity, itemId)
                    );

                    Promise.all(linkedEntityPromises).then(refDataArray => {
                        refDataArray.forEach(item => {
                            vnode.state.refData[item.id] = item;
                        });
                        m.redraw();
                    }).catch(error => console.error("[Audit][AssociationManagerView] Error fetching referenced entity data:", error));
                }).catch(error => console.error("[Audit][AssociationManagerView] Error fetching parent entity data:", error));
            }
        }).catch(error => console.error("[Audit][AssociationManagerView] Error fetching all items from child entity:", error));
    },

    addAssociation: vnode => {
        if (vnode.state.selectedItem && vnode.state.selectedItem.id) {
            vnode.state.associatedItems.push(vnode.state.selectedItem.id);
            vnode.state.selectedItem = null;
            AssociationManagerView.saveAssociations(vnode);
        }
    },

    removeAssociation: vnode => {
        if (vnode.state.selectedItem && vnode.state.selectedItem.id) {
            vnode.state.associatedItems = vnode.state.associatedItems.filter(id => id !== vnode.state.selectedItem.id);
            AssociationManagerView.saveAssociations(vnode);
        }
    },

    saveAssociations: vnode => {
        const parentEntity = vnode.attrs.entity;
        const parentId = vnode.attrs.id;
        const associationProperty = vnode.attrs.associationProperty;

        FirebaseModel.getById(parentEntity, parentId).then(parentData => {
            parentData[associationProperty] = vnode.state.associatedItems;
            FirebaseModel.saveOrUpdate(parentEntity, parentId, parentData).then(() => {
                m.redraw();
            }).catch(error => console.error("[Audit][AssociationManagerView] Error saving associations:", error));
        }).catch(error => console.error("[Audit][AssociationManagerView] Error fetching parent entity data for saving associations:", error));
    },

    getOptionLabel: (option, optionLabel) => {
        if (!optionLabel.includes(' - ')) {
            return option[optionLabel];
        }
        return optionLabel.split(' - ').map(part => option[part]).join(' - ');
    },

    view: vnode => {
        const parentEntity = vnode.attrs.entity;
        const parentData = vnode.state.parentData || {};
        const parentSchema = Entities[parentEntity].properties;
        const associationProperty = vnode.attrs.associationProperty;
        const childEntity = Entities[parentEntity].properties[associationProperty].linkTo;
        const childSchema = Entities[childEntity].properties;
        const availableItems = vnode.state.allItems.filter(item => !vnode.state.associatedItems.includes(item.id));

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: Entities[parentEntity].label, path: `/${parentEntity}` },
            { name: `Gestionar ${Entities[childEntity].label}`, path: m.route.get() }
        ];

        return m("div", [
            m(Breadcrumb, { items: breadcrumbItems }),
            m("h1", `Gestionar ${Entities[childEntity].label}`),
            m("div", [
                m("h3", `Propiedades de ${Entities[parentEntity].label}`),
                m(TableOutput, { bind: [parentData] },
                    Object.keys(parentSchema).filter(key => parentSchema[key].showInTable).map(key => {
                        return getComponentEntityProperty({ ...parentSchema[key], value: `bind.${key}`, outputMode: true });
                    })
                )
            ]),
            m("div", [
                m("h3", `Agregar ${Entities[childEntity].label}`),
                m("div", { class: 'association-form', style: { display: 'flex', alignItems: 'center' } }, [
                    m("select", {
                        style: { padding: '16px' },
                        onchange: e => {
                            const selectedItem = availableItems.find(i => i.id === e.target.value);
                            vnode.state.selectedItem = selectedItem;
                            m.redraw();
                        },
                        disabled: availableItems.length === 0
                    }, [
                        m("option", { value: "" }, "Seleccione una opción"),
                        availableItems.map(item => {
                            const label = AssociationManagerView.getOptionLabel(item, childSchema[associationProperty]?.optionLabel || 'id') || item.id;
                            return m("option", { value: item.id }, label);
                        })
                    ]),
                    m("button", {
                        onclick: () => AssociationManagerView.addAssociation(vnode),
                        disabled: !vnode.state.selectedItem || !vnode.state.selectedItem.id || availableItems.length === 0,
                        style: { marginLeft: '10px' }
                    }, `Asociar ${Entities[childEntity].label}`),
                    m("button", {
                        onclick: () => {
                            m.route.set(`/${childEntity}/new`);
                        },
                        style: { marginLeft: '10px' }
                    }, `Nuevo/a ${Entities[childEntity].label}`)
                ])
            ]),
            m("div", [
                m("h3", `Asociaciones existentes de ${Entities[childEntity].label}`),
                m(TableOutput, { bind: vnode.state.associatedItems.map(id => vnode.state.refData[id]) },
                    Object.keys(childSchema).filter(key => childSchema[key].showInTable).map(key => {
                        return getComponentEntityProperty({ ...childSchema[key], value: `bind.${key}`, outputMode: true });
                    })
                )
            ])
        ]);
    }
};

export default AssociationManagerView;
