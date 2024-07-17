const HorizontalLayout = {
    view: ({ attrs, children }) => {
        const { columns = [], className = '', ...rest } = attrs;

        // Verifica que children no esté vacío o no sea undefined
        if (!children) {
            return m('div', { class: `row ${className}`, ...rest });
        }

        return m('div', { class: `row ${className}`, ...rest },
            // Mapea sobre los children y aplica las clases de columna según la configuración
            children.map((child, index) =>
                m('div', { class: `${columns[index] || 'twelve'} columns` }, child)
            )
        );
    }
};

export default HorizontalLayout;
