const Card = {
    view: vnode => {
        const { title, useCustomPadding = true, reservePadding = false, ...attrs } = vnode.attrs;

        // Estilos adicionales si `reservePadding` es verdadero
        const cardBodyStyle = reservePadding ? { padding: "10px", boxSizing: "border-box" } : {};

        return m("div", {
            ...attrs,  // Propaga todos los demás atributos adicionales
            class: `uk-card uk-card-default uk-margin-bottom ${attrs.class || ''}`,
            style: { position: "relative", minHeight: "300px" }  // Asegura altura mínima y posición relativa
        }, [
            m("div.uk-card-header"+`${useCustomPadding ? '.custom-card-header-padding' : ''}`, [
                m("h3.uk-card-title", title),
                reservePadding && m("div", {
                    style: {
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        color: "#ffffff",
                        zIndex: 1000,
                        cursor: "pointer",
                        fontSize: "24px"
                    },
                    onclick: vnode.attrs.onExpandToggle  // Función para expandir/contraer
                }, vnode.attrs.isExpanded ? "✕" : "🔍")
            ]),
            m("div", {
                class: `uk-card-body ${useCustomPadding ? 'custom-card-body-padding' : ''}`,
                style: cardBodyStyle  // Aplica padding adicional si es necesario
            }, vnode.children),
            reservePadding && [
                m("div", {
                    style: {
                        position: "absolute",
                        top: "50%",
                        left: "10px",
                        transform: "translateY(-50%)",
                        color: "#ffffff",
                        zIndex: 1000
                    }
                }, vnode.attrs.navDates),  // Fechas de navegación
                m("div", {
                    style: {
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        color: "#ffffff",
                        zIndex: 1000
                    }
                }, vnode.attrs.counter),  // Contador de tarjetas
                m("div", {
                    style: {
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        color: "#ffffff",
                        zIndex: 1000
                    }
                }, vnode.attrs.seenCenter ? "Visto" : "No visto")  // Estado visto/no visto
            ]
        ]);
    }
};

export default Card;
