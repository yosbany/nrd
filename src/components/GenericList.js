import Table from './base/Table.js';
import Link from './base/Link.js';
import VerticalLayout from './base/VerticalLayout.js';

const GenericList = {
    view: (vnode) => {
        const { entity, items, renderItem } = vnode.attrs;

        return m(VerticalLayout, [
            m('h2', `Lista de ${entity}`),
            m(Table, {
                headers: renderItem.header,
                rows: items.map(item => renderItem.body(item))
            }),
            m(Link, { href: `/${entity}/nuevo` }, `Agregar ${entity}`)
        ]);
    }
};

export default GenericList;
