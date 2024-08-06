const TableOutput = {
    openDeleteModal: (rowId, onDelete) => {
        UIkit.modal.confirm('¿Estás seguro de que deseas eliminar este elemento?').then(() => {
            onDelete(rowId);
        }, () => {
            console.log("[Audit][TableOutput] Deletion canceled for row:", rowId);
        });
    },

    resolveBindValue: (row, bindPath) => {
        if (typeof bindPath !== 'string' || !bindPath.startsWith('bind.')) {
            console.warn(`[Audit][TableOutput] Invalid bindPath: ${bindPath}`);
            return undefined;
        }

        const pathParts = bindPath.split('.').slice(1);
        console.log(`[Audit][TableOutput] Resolving bindPath: ${bindPath} with pathParts: ${pathParts}`);

        return pathParts.reduce((acc, key) => {
            if (acc && acc.hasOwnProperty(key)) {
                return acc[key];
            } else {
                console.warn(`[Audit][TableOutput] Key not found: ${key} in acc:`, acc);
                return undefined;
            }
        }, row);
    },

    view: vnode => {
        const { bind, label, showLabel, onEdit, onDelete } = vnode.attrs;
        const columns = vnode.children;

        return m("div.uk-margin", [
            showLabel !== false && label && m("h2.uk-heading-bullet", label),
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
                                            resolvedAttrs[attrKey] = TableOutput.resolveBindValue(row, attrValue);
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
                                    m("button.uk-button.uk-button-default.uk-button-small", {
                                        onclick: () => onEdit(row.id)
                                    }, "Editar"),
                                    m("button.uk-button.uk-button-danger.uk-button-small.uk-margin-small-left", {
                                        onclick: () => TableOutput.openDeleteModal(row.id, onDelete)
                                    }, "Eliminar")
                                ])
                            ]
                        )
                    )
                )
            ])
        ]);
    }
};

export default TableOutput;
