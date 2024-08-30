const Card = {
    view: (vnode) => {
        const { background, title } = vnode.attrs;
        const cardClass = `uk-card uk-card-default ${background ? `uk-background-${background}` : ''}`;
        const headerClass = 'uk-card-header uk-padding-samll';

        return m('div', { class: cardClass }, [
            title ? m('div', { class: headerClass }, 
                m('span', { class: 'uk-card-title' }, title)
            ) : null,
            m('div', { class: 'uk-card-body' }, vnode.children)
        ]);
    }
};

export default Card;
