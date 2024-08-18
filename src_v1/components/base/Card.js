// Card.js
const Card = {
    view: vnode => {
        const { title, useCustomPadding = true } = vnode.attrs;

        return m("div.uk-card.uk-card-default.uk-margin-bottom", [
            m("div.uk-card-header", [
                m("h3.uk-card-title", title)
            ]),
            m("div", {
                class: `uk-card-body ${useCustomPadding ? 'custom-card-body-padding' : ''}`
            }, vnode.children)
        ]);
    }
};

export default Card;
