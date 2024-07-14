const Table = {
    view: (vnode) => {
        const { headers, rows } = vnode.attrs;
        return m('table', { class: 'table' }, [
            m('thead', [
                m('tr', headers.map(header => m('th', header)))
            ]),
            m('tbody', rows.map(row => m('tr', row)))
        ]);
    }
};

export default Table;
