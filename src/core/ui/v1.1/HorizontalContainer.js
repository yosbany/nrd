const HorizontalContainer = {
    view: (vnode) => {
        return m('div', { class: 'uk-flex uk-flex-between uk-margin', style: { gap: '10px' } }, vnode.children);
    }
};

export default HorizontalContainer;
