const Grid = {
    view: (vnode) => {
        const { tight, width } = vnode.attrs;

        const gridWidth = width 
            ? width.split(',').map(w => `uk-width-${w.trim()}`).join(' ')
            : 'uk-width-1-1@s uk-width-1-2@m uk-width-1-4@l';

        const gridClass = `uk-grid uk-grid-match uk-grid-small ${tight ? 'uk-grid-collapse' : ''}`;

        return m('div', { class: gridClass }, 
            vnode.children.map(child =>
                m('div', { class: gridWidth }, 
                    m('div', { class: 'uk-height-1-1', style: tight ? '' : 'padding: 5px;' }, child)
                )
            )
        );
    }
};

export default Grid;
