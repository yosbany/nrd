const HeadingDivider = {
    view: (vnode) => {
        const { title, centered } = vnode.attrs;

        // Si no hay título y no está centrado, solo muestra la línea divisoria
        if (!title && !centered) {
            return m('h1.uk-heading-divider');
        }

        // Si no hay título pero está centrado, muestra una línea centrada
        if (!title && centered) {
            return m('h1.uk-heading-line uk-text-center', m('span'));
        }

        // Si hay título y está centrado, muestra el texto centrado con una línea
        if (title && centered) {
            return m('h1.uk-heading-line uk-text-center', m('span', title));
        }

        // Si hay título pero no está centrado, muestra el título con la línea divisoria
        return m('h1.uk-heading-divider', title);
    }
};

export default HeadingDivider;
