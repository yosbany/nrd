import FirebaseModel from '../models/FirebaseModel.js';
import Entities from '../config/Entities.js';
import { getComponentEntityProperty } from '../utils.js';
import TableOutput from './base/TableOutput.js';
import Breadcrumb from './base/Breadcrumb.js';
import TextInput from './base/TextInput.js';
import Button from './base/Button.js';
import Fila from './base/Fila.js';
import Column from './base/Column.js';
import Card from './base/Card.js';

const EntityManagerView = {
    oninit: vnode => {
        console.log("[Audit][EntityManagerView] Initializing for entity:", vnode.attrs.entity);

        vnode.state.searchText = '';
        vnode.state.items = [];
        vnode.state.loading = true;
        vnode.state.sortKey = null;
        vnode.state.sortOrder = 'asc';
        vnode.state.currentEntity = vnode.attrs.entity;

        if (Entities[vnode.attrs.entity]) {
            EntityManagerView.loadList(vnode);
        } else {
            vnode.state.loading = false;
            console.warn("[Audit][EntityManagerView] Entity not found during initialization:", vnode.attrs.entity);
        }
    },

    onbeforeupdate: vnode => {
        if (!Entities[vnode.attrs.entity]) {
            console.warn("[Audit][EntityManagerView] Entity not found on update:", vnode.attrs.entity);
            vnode.state.loading = false;
            return;
        }
        if (vnode.attrs.entity !== vnode.state.currentEntity) {
            console.log("[Audit][EntityManagerView] Entity changed from", vnode.state.currentEntity, "to", vnode.attrs.entity);
            vnode.state.currentEntity = vnode.attrs.entity;
            vnode.state.loading = true;
            EntityManagerView.loadList(vnode);
        }
    },

    loadList: vnode => {
        console.log("[Audit][EntityManagerView] Loading list for entity:", vnode.attrs.entity);

        FirebaseModel.getAll(vnode.attrs.entity)
            .then(data => {
                vnode.state.items = data;
                vnode.state.loading = false;
                console.log("[Audit][EntityManagerView] Loaded items for entity:", vnode.attrs.entity, data);
                m.redraw();
            })
            .catch(error => {
                console.error("[Audit][EntityManagerView] Error loading list for entity:", vnode.attrs.entity, error);
                vnode.state.loading = false;
                m.redraw();
            });
    },

    filterItems: vnode => {
        if (!vnode.state.searchText) return vnode.state.items;

        const searchText = vnode.state.searchText.toLowerCase();
        console.log("[Audit][EntityManagerView] Filtering items with search text:", searchText);
        return vnode.state.items.filter(item =>
            Object.values(item).some(value =>
                value && value.toString().toLowerCase().includes(searchText)
            )
        );
    },

    sortItems: (vnode, key) => {
        console.log("[Audit][EntityManagerView] Sorting items by key:", key);

        vnode.state.sortOrder = vnode.state.sortKey === key && vnode.state.sortOrder === 'asc' ? 'desc' : 'asc';
        vnode.state.sortKey = key;

        vnode.state.items.sort((a, b) => {
            if (a[key] < b[key]) return vnode.state.sortOrder === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return vnode.state.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        console.log("[Audit][EntityManagerView] Sorted items:", vnode.state.items);
    },

    onEdit: (vnode, id) => {
        console.log("[Audit][EntityManagerView] Edit button clicked for item ID:", id);
        m.route.set(`/${vnode.attrs.entity}/${id}`);
    },

    onDelete: (vnode, id) => {
        console.log("[Audit][EntityManagerView] Delete button clicked for item ID:", id);
        FirebaseModel.delete(vnode.attrs.entity, id)
            .then(() => {
                console.log("[Audit][EntityManagerView] Deleted item ID:", id);
                EntityManagerView.loadList(vnode);
            })
            .catch(error => console.error("[Audit][EntityManagerView] Error deleting item ID:", id, error));
    },

    renderColumn: (property, key) => {
        const value = `bind.${key}`;
        return getComponentEntityProperty(property, value);
    },

    view: vnode => {
        if (vnode.state.loading) {
            console.log("[Audit][EntityManagerView] Entity list is loading...");
            return m("div.uk-text-center", "Cargando...");
        }

        if (!Entities[vnode.attrs.entity]) {
            console.warn("[Audit][EntityManagerView] Entity not found in view:", vnode.attrs.entity);
            return m("div.uk-alert-danger", "Entidad no encontrada.");
        }

        const propertiesSchema = Entities[vnode.attrs.entity].properties;
        const filteredItems = EntityManagerView.filterItems(vnode);
        const tableHeaders = Object.keys(propertiesSchema).filter(key => propertiesSchema[key].showInTable);
        console.log("[Audit][EntityManagerView] Rendering entity list view for:", vnode.attrs.entity);
        console.log("[Audit][EntityManagerView] Table headers:", tableHeaders);

        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: Entities[vnode.attrs.entity].label, path: `/${vnode.attrs.entity}` }
        ];

        return m(Card, { title: `Listado de ${Entities[vnode.attrs.entity].label}`, useCustomPadding: false  }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: 'expand' }, [
                    m(TextInput, {
                        value: vnode.state.searchText,
                        onInput: value => {
                            vnode.state.searchText = value;
                            console.log("[Audit][EntityManagerView] Search input changed to:", vnode.state.searchText);
                        },
                        placeholder: "Buscar...",
                        showLabel: false
                    })
                ]),
                m(Column, { width: 'auto' }, [
                    m(Button, {
                        type: "primary",
                        label: "Nuevo",
                        onClick: () => {
                            m.route.set(`/${vnode.attrs.entity}/new`);
                        },
                        documentation: "Crear nuevo registro"
                    })
                ])
            ]),
            m(TableOutput, { 
                bind: filteredItems,
                onEdit: id => EntityManagerView.onEdit(vnode, id),
                onDelete: id => EntityManagerView.onDelete(vnode, id)
            }, 
                tableHeaders.map(key => EntityManagerView.renderColumn(propertiesSchema[key], key))
            ),
            filteredItems.length === 0 && m("div.uk-alert-warning", { style: { textAlign: 'center' } }, "No se encontraron resultados")
        ]);
    }
};

export default EntityManagerView;
