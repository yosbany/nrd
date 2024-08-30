import Button from "./Button.js";
import Modal from "./Modal.js";

const Table = {
    oninit: vnode => {
        vnode.state.showDeleteModal = false;  // Estado para controlar el modal de confirmación de eliminación
        vnode.state.itemToDelete = null;  // Estado para almacenar el ítem que se quiere eliminar
    },

    confirmDelete: (vnode, item) => {
        vnode.state.itemToDelete = item;
        vnode.state.showDeleteModal = true;
    },

    deleteItem: vnode => {
        const { onDelete } = vnode.attrs;
        if (vnode.state.itemToDelete) {
            onDelete(vnode.state.itemToDelete.id);
            vnode.state.showDeleteModal = false;
            vnode.state.itemToDelete = null;
        }
    },

    resolvePath: (obj, path) => {
        return path.split('.').reduce((prev, curr) => prev ? prev[curr] : undefined, obj);;
    },
    

    view: vnode => {
        const { bind, onEdit, additionalActions = [] } = vnode.attrs;
        const columns = vnode.children;

        return m("div.uk-margin", [
            m("table.uk-table.uk-table-small.uk-table-middle.uk-table-divider.uk-table-hover.uk-table-responsive", [
                m("thead", 
                    m("tr", [
                        ...columns.map((column, index) => 
                            m("th", { key: index, class: "uk-visible@s" }, column.attrs.label)
                        ),
                        m("th", { key: "actions-header", style: { textAlign: 'right' }, class: "uk-visible@s" }, "Acciones")
                    ])
                ),
                m("tbody", 
                    bind.map((row, rowIndex) => 
                        m("tr", { key: rowIndex }, 
                            [
                                ...columns.map((column, colIndex) => {
                                    const Component = column.tag;
                                    const resolvedAttrs = {};

                                    Object.keys(column.attrs).forEach(attrKey => {
                                        const attrValue = column.attrs[attrKey];
                                        if (typeof attrValue === 'string' && attrValue.startsWith('bind.')) {
                                            resolvedAttrs[attrKey] = Table.resolvePath(row, attrValue.replace('bind.', ''));
                                        } else {
                                            resolvedAttrs[attrKey] = attrValue;
                                        }
                                    });

                                    return m.fragment({ key: colIndex }, [
                                        // Pantalla pequeña: Mostrar label y valor
                                        m("td", { class: "uk-hidden@s uk-text-bold" }, `${column.attrs.label}: `),
                                        m("td", { class: "uk-hidden@s" },
                                            m(Component, {
                                                ...resolvedAttrs,
                                                showLabel: false,
                                                outputMode: true
                                            })
                                        ),
                                        // Pantalla grande: Mostrar solo el valor
                                        m("td", { class: "uk-visible@s" }, 
                                            m(Component, {
                                                ...resolvedAttrs,
                                                showLabel: false,
                                                outputMode: true
                                            })
                                        )
                                    ]);
                                }),
                                // Acciones en pantalla pequeña
                                m("td", { key: `actions-mobile-${rowIndex}`, class: "uk-hidden@s" }, [
                                    m("div", { class: "uk-flex uk-flex-row uk-flex-wrap" }, [
                                        ...additionalActions.map((action, actionIndex) =>
                                            m("a.uk-icon-button.uk-margin-small-right", {
                                                key: `action-mobile-${rowIndex}-${actionIndex}`,
                                                "uk-icon": action.icon,
                                                style: action.style || {},
                                                title: action.title,
                                                onclick: () => action.onClick(row)
                                            })
                                        ),
                                        m("a.uk-icon-button.uk-margin-small-right", {
                                            key: `edit-mobile-${rowIndex}`,
                                            "uk-icon": "pencil",
                                            style: { backgroundColor: 'lightskyblue' },
                                            title: "Editar",
                                            onclick: () => onEdit(row.id)
                                        }),
                                        m("a.uk-icon-button.uk-margin-small-right", {
                                            key: `delete-mobile-${rowIndex}`,
                                            "uk-icon": "trash",
                                            style: { backgroundColor: 'coral' },
                                            title: "Eliminar",
                                            onclick: () => Table.confirmDelete(vnode, row)
                                        })
                                    ])
                                ]),
                                // Acciones en pantalla grande
                                m("td", { key: `actions-${rowIndex}`, style: { textAlign: 'right', whiteSpace: 'nowrap' }, class: "uk-visible@s" }, [
                                    ...additionalActions.map((action, actionIndex) =>
                                        m("a.uk-icon-button.uk-margin-small-right", {
                                            key: `action-${rowIndex}-${actionIndex}`,
                                            "uk-icon": action.icon,
                                            style: action.style || {},
                                            title: action.title,
                                            onclick: () => action.onClick(row)
                                        })
                                    ),
                                    m("a.uk-icon-button.uk-margin-small-right", {
                                        key: `edit-${rowIndex}`,
                                        "uk-icon": "pencil",
                                        style: { backgroundColor: 'lightskyblue' },
                                        title: "Editar",
                                        onclick: () => onEdit(row.id)
                                    }),
                                    m("a.uk-icon-button.uk-margin-small-right", {
                                        key: `delete-${rowIndex}`,
                                        "uk-icon": "trash",
                                        style: { backgroundColor: 'coral' },
                                        title: "Eliminar",
                                        onclick: () => Table.confirmDelete(vnode, row)
                                    })
                                ])
                            ]
                        )
                    )
                )
            ]),
            vnode.state.showDeleteModal && m(Modal, {
                show: vnode.state.showDeleteModal,
                title: "Confirmar Eliminación",
                onClose: () => {
                    vnode.state.showDeleteModal = false;
                    vnode.state.itemToDelete = null;
                },
                content: "¿Está seguro que desea eliminar este ítem?",
            }, [
                m("div.uk-flex.uk-flex-right.uk-margin-top", [
                    m(Button, {
                        label: "Cancelar",
                        onClick: () => {
                            vnode.state.showDeleteModal = false;
                            vnode.state.itemToDelete = null;
                        },
                        style: { marginRight: "10px" }
                    }),
                    m(Button, {
                        label: "Eliminar",
                        type: "danger",
                        onClick: () => Table.deleteItem(vnode)
                    })
                ])
            ])
        ]);
    }
};

export default Table;