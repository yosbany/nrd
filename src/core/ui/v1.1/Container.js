const Container = {
    view: (vnode) => {
        const sizeClass = vnode.attrs.size ? `uk-container-${vnode.attrs.size}` : 'uk-container-expand';
        return m('div', { class: `uk-container container-custom-padding ${sizeClass}`},
            vnode.children
        );
    }
};

export default Container;
