
import FirebaseModel from '../models/FirebaseModel.js';
import Entities from '../config/Entities.js';
import { loadDynamicOptions } from '../utils.js';

const EntityList = {
    oninit: vnode => {
        vnode.state.showActions = {}; // Estado para controlar la visibilidad del menú de acciones por fila
        vnode.state.searchText = ''; // Estado para almacenar el texto de búsqueda
        vnode.state.items = []; // Estado para almacenar los elementos de la tabla
        vnode.state.dynamicLabels = {}; // Estado para almacenar los labels dinámicos
        vnode.state.loading = true; // Estado para controlar si está cargando

        EntityList.loadList(vnode);

        // Añadir un manejador de eventos global para detectar clics fuera del menú de contexto
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.context-menu') && !event.target.closest('.icon-button')) {
                vnode.state.showActions = {};
                m.redraw();
            }
        });
    },
    onbeforeupdate: vnode => {
        if (vnode.attrs.entity !== vnode.state.currentEntity) {
            vnode.state.currentEntity = vnode.attrs.entity;
            vnode.state.loading = true; // Estado para controlar si está cargando
            EntityList.loadList(vnode);
        }
    },
    loadList: vnode => {
        FirebaseModel.getAll(vnode.attrs.entity).then(async data => {
            vnode.state.items = data;
            const dynamicLabels = await loadDynamicOptions(vnode.attrs.entity, Entities[vnode.attrs.entity].properties);
            console.log("dynamicLabels: ",dynamicLabels);
            return dynamicLabels;
        }).then(dynamicLabels => {
            vnode.state.dynamicLabels = dynamicLabels;
            vnode.state.loading = false; // Indicar que ya no está cargando
            m.redraw();
        });
    },
    toggleActions: (vnode, id) => {
        vnode.state.showActions[id] = !vnode.state.showActions[id];
    },
    hideActions: (vnode, id) => {
        vnode.state.showActions[id] = false;
    },
    filterItems: vnode => {
        if (!vnode.state.searchText) {
            return vnode.state.items;
        }
        const searchText = vnode.state.searchText.toLowerCase();
        return vnode.state.items.filter(item => {
            return Object.values(item).some(value => 
                value && value.toString().toLowerCase().includes(searchText)
            );
        });
    },
    view: vnode => {
        if (vnode.state.loading) {
            return m("div", "Cargando..."); // Mostrar un mensaje de carga mientras se obtienen los datos
        }

        const entitySchema = Entities[vnode.attrs.entity].properties;
        const tableHeaders = Object.keys(entitySchema).filter(key => entitySchema[key].showInTable);
        return m("div", [
            m("h1", `Listado de ${Entities[vnode.attrs.entity].label}`),
            m("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' } }, [
                m("input[type=text]", {
                    style: { marginRight: '10px' },
                    placeholder: "Buscar...",
                    oninput: e => {
                        vnode.state.searchText = e.target.value;
                        m.redraw();
                    },
                    value: vnode.state.searchText
                }),
                m("button", { onclick: () => m.route.set(`/${vnode.attrs.entity}/new`) }, "Nuevo")
            ]),
            m("table", [
                m("thead", [
                    m("tr", [
                        ...tableHeaders.map(key => m("th", entitySchema[key].label)),
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
                                    return m("td", option ? option.label : value);
                                }
                                return m("td", value);
                            }),
                            m("td", { style: { position: 'relative', textAlign: 'right', whiteSpace: 'nowrap', width: '30px' } }, [
                                m("button.icon-button", {
                                    onclick: e => {
                                        e.stopPropagation();
                                        EntityList.toggleActions(vnode, item.id);
                                    }
                                }, "⋮"),
                                vnode.state.showActions[item.id] && m("div.context-menu", {
                                    onclick: e => e.stopPropagation()
                                }, [
                                    m("button", { onclick: () => {
                                        EntityList.hideActions(vnode, item.id);
                                        m.route.set(`/${vnode.attrs.entity}/${item.id}`);
                                    } }, "Editar"),
                                    m("button", { onclick: () => {
                                        EntityList.hideActions(vnode, item.id);
                                        if (window.confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
                                            FirebaseModel.delete(vnode.attrs.entity, item.id).then(() => {
                                                EntityList.loadList(vnode); // Recargar la lista después de eliminar
                                            });
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
