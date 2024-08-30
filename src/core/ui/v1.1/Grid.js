const Grid = {
    view: (vnode) => {
        const { tight } = vnode.attrs;
        const gridClass = `uk-grid uk-grid-match uk-grid-small ${tight ? 'uk-grid-collapse' : ''}`;

        return m('div', { class: gridClass }, 
            vnode.children.map(child =>
                m('div', { class: 'uk-width-1-1@s uk-width-1-2@m uk-width-1-4@l', style: tight ? '' : 'padding: 3px;' }, 
                    m('div', { class: 'uk-height-1-1' }, child)
                )
            )
        );
    }
};

export default Grid;
