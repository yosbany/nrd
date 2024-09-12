const ResponsiveRow = {
    view: (vnode) => {
        const { gap = 'medium', ...attrs } = vnode.attrs;

        return m('div', {
            class: `uk-grid uk-grid-${gap}`,  // Aplicar el grid y el gap de UIkit
            'uk-grid': true,  // Habilitar el grid de UIkit
            ...attrs
        }, vnode.children.map(child => {
            // Pasar directamente las clases `uk-width` de los hijos como `ukWidth`
            const { ukWidth = 'uk-width-1-1' } = child.attrs;  // Clase por defecto si no se pasa ninguna

            return m('div', {
                class: ukWidth  // Aplicar las clases `uk-width-*` directamente
            }, child);
        }));
    }
};

export default ResponsiveRow;
