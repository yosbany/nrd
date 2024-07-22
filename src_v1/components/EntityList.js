import FirebaseModel from '../models/FirebaseModel.js';
import Entities from '../config/Entities.js';
import { loadDynamicOptions } from '../utils.js';

const EntityList = {
    oninit: vnode => {
        console.log("[Audit] Initializing EntityList...");

        if (!Entities[vnode.attrs.entity]) {
            console.warn("[Audit] Entity not found:", vnode.attrs.entity);
            vnode.state.loading = false;
            return;
        }

        vnode.state.showActions = null; // Estado para controlar la visibilidad del menú de acciones por fila
        vnode.state.searchText = ''; // Estado para almacenar el texto de búsqueda
        vnode.state.items = []; // Estado para almacenar los elementos de la tabla
        vnode.state.dynamicLabels = {}; // Estado para almacenar los labels dinámicos
        vnode.state.loading = true; // Estado para controlar si está cargando
        vnode.state.sortKey = null; // Clave de la columna por la que se está ordenando
        vnode.state.sortOrder = 'asc'; // Orden de la columna (asc o desc)

        console.log("[Audit] Initial state:", vnode.state);

        if (Entities[vnode.attrs.entity]) {
            EntityList.loadList(vnode);
        } else {
            vnode.state.loading = false;
        }

        // Añadir un manejador de eventos global para detectar clics fuera del menú de contexto
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.context-menu') && !event.target.closest('.icon-button')) {
                vnode.state.showActions = null;
                console.log("[Audit] Click detected outside context menu, hiding all action menus.");
                m.redraw();
            }
        });
    },
    onbeforeupdate: vnode => {
        if (!Entities[vnode.attrs.entity]) {
            console.warn("[Audit] Entity not found on update:", vnode.attrs.entity);
            vnode.state.loading = false;
            return;
        }
        if (vnode.attrs.entity !== vnode.state.currentEntity) {
            console.log("[Audit] Entity changed:", vnode.attrs.entity);
            vnode.state.currentEntity = vnode.attrs.entity;
            vnode.state.loading = true; // Estado para controlar si está cargando
            if (Entities[vnode.attrs.entity]) {
                EntityList.loadList(vnode);
            } else {
                vnode.state.loading = false;
            }
        }
    },
    loadList: vnode => {
        console.log("[Audit] Loading list for entity:", vnode.attrs.entity);

        FirebaseModel.getAll(vnode.attrs.entity).then(async data => {
            vnode.state.items = data;
            console.log("[Audit] Loaded items:", data);

            const dynamicLabels = await loadDynamicOptions(vnode.attrs.entity, Entities[vnode.attrs.entity].properties);
            return dynamicLabels;
        }).then(dynamicLabels => {
            vnode.state.dynamicLabels = dynamicLabels;
            vnode.state.loading = false; // Indicar que ya no está cargando
            console.log("[Audit] Loaded dynamic labels:", dynamicLabels);
            m.redraw();
        }).catch(error => {
            console.error("[Audit] Error loading list:", error);
            vnode.state.loading = false;
            m.redraw();
        });
    },
    toggleActions: (vnode, id) => {
        console.log("[Audit] Toggling actions for item ID:", id);
        vnode.state.showActions = vnode.state.showActions === id ? null : id;
        console.log("[Audit] showActions state:", vnode.state.showActions);
        m.redraw();
    },
    filterItems: vnode => {
        if (!vnode.state.searchText) {
            return vnode.state.items;
        }
        const searchText = vnode.state.searchText.toLowerCase();
        console.log("[Audit] Filtering items with search text:", searchText);
        return vnode.state.items.filter(item => {
            return Object.values(item).some(value => 
                value && value.toString().toLowerCase().includes(searchText)
            );
        });
    },
    sortItems: (vnode, key) => {
        console.log("[Audit] Sorting items by key:", key);

        if (vnode.state.sortKey === key) {
            vnode.state.sortOrder = vnode.state.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            vnode.state.sortKey = key;
            vnode.state.sortOrder = 'asc';
        }

        vnode.state.items.sort((a, b) => {
            if (a[key] < b[key]) return vnode.state.sortOrder === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return vnode.state.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        console.log("[Audit] Sorted items:", vnode.state.items);
    },
    view: vnode => {
        if (vnode.state.loading) {
            console.log("[Audit] Entity list is loading...");
            return m("div", "Cargando..."); // Mostrar un mensaje de carga mientras se obtienen los datos
        }

        if (!Entities[vnode.attrs.entity]) {
            console.warn("[Audit] Entity not found on view:", vnode.attrs.entity);
            return m("div", "Entidad no encontrada.");
        }

        const entitySchema = Entities[vnode.attrs.entity].properties;
        const tableHeaders = Object.keys(entitySchema).filter(key => entitySchema[key].showInTable);
        console.log("[Audit] Rendering entity list view for:", vnode.attrs.entity);

        return m("div", [
            m("h1", `Listado de ${Entities[vnode.attrs.entity].label}`),
            m("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' } }, [
                m("input[type=text]", {
                    style: { marginRight: '10px' },
                    placeholder: "Buscar...",
                    oninput: e => {
                        vnode.state.searchText = e.target.value;
                        console.log("[Audit] Search input changed to:", vnode.state.searchText);
                        m.redraw();
                    },
                    value: vnode.state.searchText
                }),
                m("button", { style: {marginRight: '0px'}, onclick: () => {
                    console.log("[Audit] New button clicked");
                    m.route.set(`/${vnode.attrs.entity}/new`);
                } }, "Nuevo")
            ]),
            m("table", [
                m("thead", [
                    m("tr", [
                        ...tableHeaders.map(key => m("th", { 
                            title: entitySchema[key].documentation || "",
                            style: { cursor: entitySchema[key].sortable ? 'pointer' : 'default' },
                            onclick: entitySchema[key].sortable ? () => EntityList.sortItems(vnode, key) : undefined
                        }, [
                            entitySchema[key].label,
                            entitySchema[key].sortable && vnode.state.sortKey === key ? (vnode.state.sortOrder === 'asc' ? ' 🔼' : ' 🔽') : ''
                        ])),
                        m("th", { style: { textAlign: 'right', whiteSpace: 'nowrap' } }, "")
                    ])
                ]),
                m("tbody", vnode.state.items && vnode.state.items.length > 0 ? 
                    EntityList.filterItems(vnode).map(item => 
                        m("tr", { key: item.id }, [
                            ...tableHeaders.map(key => {
                                const value = item[key];
                                const property = entitySchema[key];
                                if (property.inputType === 'select' && property.linkTo && vnode.state.dynamicLabels[key]) {
                                    const option = vnode.state.dynamicLabels[key].find(option => option.value === value);
                                    return m("td", { title: property.documentation || "" }, option ? option.label : value);
                                } else if (property.type === 'base64' && value) {
                                    return m("td", { title: property.documentation || "" }, [
                                        m("img", {
                                            src: `data:image/*;base64,${value}`,
                                            style: { width: '50px', height: '50px' }
                                        })
                                    ]);
                                }
                                return m("td", { title: property.documentation || "" }, value);
                            }),
                            m("td", { style: { position: 'relative', textAlign: 'right', whiteSpace: 'nowrap', width: '30px' } }, [
                                m("button.icon-button", {
                                    style: {marginRight: '0px'},
                                    onclick: e => {
                                        e.stopPropagation();
                                        console.log("[Audit] Action button clicked for item ID:", item.id);
                                        EntityList.toggleActions(vnode, item.id);
                                    }
                                }, "⋮"),
                                vnode.state.showActions === item.id && m("div.context-menu", {
                                    onclick: e => e.stopPropagation()
                                }, [
                                    m("button", { onclick: () => {
                                        EntityList.toggleActions(vnode, item.id);
                                        console.log("[Audit] Edit button clicked for item ID:", item.id);
                                        m.route.set(`/${vnode.attrs.entity}/${item.id}`);
                                    } }, "Editar"),
                                    m("button", { onclick: () => {
                                        EntityList.toggleActions(vnode, item.id);
                                        console.log("[Audit] Delete button clicked for item ID:", item.id);
                                        if (window.confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
                                            FirebaseModel.delete(vnode.attrs.entity, item.id).then(() => {
                                                console.log("[Audit] Deleted item ID:", item.id);
                                                EntityList.loadList(vnode); // Recargar la lista después de eliminar
                                            }).catch(error => console.error("[Audit] Error deleting item:", error));
                                        }
                                    } }, "Eliminar")
                                ])
                            ])
                        ])
                    ) : 
                    m("tr", m("td", { colspan: tableHeaders.length + 1, style: { textAlign: 'center' } }, "No se encontraron resultados"))
                )
            ])
        ]);
    }
};

export default EntityList;
