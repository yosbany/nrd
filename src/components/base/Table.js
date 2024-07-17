export const Table = {
    view: ({ attrs }) => {
        const { headers, body, label, labelPosition = 'top' } = attrs;
        return m('div', { class: 'Table' }, [
            m('div', { class: `label-${labelPosition}` }, [
                label && m('h5', label),
                m('table.u-full-width', [
                    headers && m('thead',
                        m('tr',
                            headers.map(header => m('th', header))
                        )
                    ),
                    body && m('tbody',
                        body.map(row =>
                            m('tr',
                                row.map(cell => m('td', { class: 'table-cell' }, cell))
                            )
                        )
                    )
                ])
            ])
        ]);
    }
};
