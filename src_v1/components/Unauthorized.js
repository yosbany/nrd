const Unauthorized = {
    view: () => {
        return m("div", [
            m("h1", "Unauthorized"),
            m("p", "No tiene permiso para acceder a esta página."),
            m("button", {
                onclick: () => m.route.set('/home')
            }, "Volver al inicio")
        ]);
    }
};

export default Unauthorized;
