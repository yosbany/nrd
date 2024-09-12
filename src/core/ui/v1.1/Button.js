const Button = {
    view: vnode => {
        const { label, documentation, width = '100%', class: additionalClasses = '', ...attrs } = vnode.attrs;

        return m("div", { component: "Button", style: { flexBasis: width } }, [
            m("button", {
                class: `uk-button ${additionalClasses}`,
                title: documentation || "",
                style: { width: '100%' },  // Asegurar que el botón ocupe todo el ancho del contenedor flexible
                ...attrs
            }, label)
        ]);
    }
};

export default Button;
