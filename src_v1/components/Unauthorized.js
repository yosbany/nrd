const Unauthorized = {
    view: () => {
        console.log("[Audit][Unauthorized] Rendering Unauthorized view...");

        return m("div", [
            m("h1", "Unauthorized"),
            m("p", "No tiene permiso para acceder a esta página."),
            m("button", {
                onclick: () => {
                    console.log("[Audit][Unauthorized] Return to home button clicked.");
                    m.route.set('/home');
                }
            }, "Volver al inicio")
        ]);
    }
};

export default Unauthorized;
