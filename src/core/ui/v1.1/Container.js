const Container = {
    view: (vnode) => {
        const sizeClass = vnode.attrs.size ? `uk-container-${vnode.attrs.size}` : 'uk-container-expand';
        return m('div', { class: `uk-container ${sizeClass} uk-flex uk-flex-center uk-flex-middle`, style: { margin: '0 auto', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' } },
            m('div', { class: 'uk-width-1-1', style: { maxWidth: '100%', padding: 0 } }, vnode.children)
        );
    }
};

export default Container;
