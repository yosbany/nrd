const Table = {
    view: vnode => {
        const { bind, onEdit, onDelete } = vnode.attrs;
        const columns = vnode.children;

        // Función para resolver los paths de un objeto anidado
        const resolvePath = (obj, path) => {
            return path.split('.').reduce((prev, curr) => prev ? prev[curr] : undefined, obj);
        };

        return m("div.uk-margin", [
            m("table.uk-table.uk-table-small.uk-table-middle.uk-table-divider.uk-table-hover.uk-table-responsive", [
                m("thead",
                    m("tr", [
                        ...columns.map((column, index) => 
                            m("th", { key: index }, column.attrs.label)
                        ),
                        m("th", { key: "actions", style: { textAlign: 'right' } }, "Acciones")
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
                                            // Resuelve la ruta completa, por ejemplo, bind.preferredSupplierKey.businessName
                                            resolvedAttrs[attrKey] = resolvePath(row, attrValue.replace('bind.', ''));
                                        } else {
                                            resolvedAttrs[attrKey] = attrValue;
                                        }
                                    });

                                    return m("td", { key: colIndex },
                                        m(Component, {
                                            ...resolvedAttrs,
                                            showLabel: false,
                                            outputMode: true
                                        })
                                    );
                                }),
                                m("td", { key: `actions-${rowIndex}`, style: { textAlign: 'right', whiteSpace: 'nowrap' } }, [
                                    m("a.uk-icon-button.uk-margin-small-right", {
                                        "uk-icon": "pencil",
                                        style: { backgroundColor: 'lightskyblue' },
                                        title: "Editar",
                                        onclick: () => onEdit(row.id)
                                    }),
                                    m("a.uk-icon-button.uk-margin-small-right", {
                                        "uk-icon": "trash",
                                        style: { backgroundColor: 'coral' },
                                        title: "Eliminar",
                                        onclick: () => onDelete(row.id)
                                    })
                                ])
                            ]
                        )
                    )
                )
            ])
        ]);
    }
};

export default Table;
