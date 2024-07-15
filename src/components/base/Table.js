const Table = {
    view: (vnode) => {
        return m('table', { class: 'table table-striped' }, [
            m('thead', m('tr', vnode.attrs.headers.map(header => m('th', header)))),
            m('tbody', vnode.attrs.rows.map(row =>
                m('tr', row.map(cell => m('td', cell)))
            ))
        ]);
    }
};

export default Table;
