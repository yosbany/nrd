import SecurityModel from '../models/SecurityModel.js';
import MenuConfig from '../config/MenuConfig.js';

const Menu = {
    oninit: vnode => {
        vnode.state.categories = {};
        vnode.state.directLinks = [];

        // Agrupar rutas por categoría y manejar las que no tienen categoría
        Object.keys(MenuConfig).forEach(entityKey => {
            const config = MenuConfig[entityKey];
            if (config.category) {
                const category = config.category;
                if (!vnode.state.categories[category]) {
                    vnode.state.categories[category] = [];
                }
                vnode.state.categories[category].push({ ...config, key: entityKey });
            } else {
                vnode.state.directLinks.push({ ...config, key: entityKey });
            }
        });
    },

    navigateToRoute: (route) => {
        SecurityModel.hasAccessToRoute(route.pathRouter).then(hasAccess => {
            if (hasAccess) {
                console.log("[Audit][Menu] Navigating to route:", route);
                m.route.set(route.pathRouter);
            } else {
                console.log("[Audit][Menu] User does not have access to the route:", route);
                m.route.set('/unauthorized');
            }

            // Cerrar todos los dropdowns abiertos
            const dropdowns = document.querySelectorAll('.uk-dropdown');
            dropdowns.forEach(dropdown => {
                UIkit.dropdown(dropdown).hide();
            });

            // Cerrar el menú Offcanvas si está abierto
            const offcanvas = document.querySelector("#offcanvas-nav");
            if (offcanvas.classList.contains("uk-open")) {
                UIkit.offcanvas(offcanvas).hide();
            }
        });
    },

    view: vnode => {
        return m("nav.uk-navbar-container", { "uk-navbar": "" }, [
            m("div.uk-navbar-left", [
                // Mostrar el ícono de Offcanvas solo en pantallas pequeñas
                m("a.uk-navbar-toggle.uk-hidden@m", { 
                    "uk-navbar-toggle-icon": "", 
                    "uk-toggle": "target: #offcanvas-nav",
                    style: { marginLeft: "8px" } // Agrega un margen pequeño a la izquierda
                }),
                m("div.uk-navbar-item.uk-logo", { style: { marginLeft: "20px" } }, "NUEVA RÍO D'OR") // Ajuste aquí
            ]),
            // Menú tradicional visible solo en pantallas grandes
            m("div.uk-navbar-right.uk-visible@m", [
                m("ul.uk-navbar-nav", { style: { padding: "0 15px" } }, [
                    // Links directos (sin categoría)
                    vnode.state.directLinks.map(route =>
                        m("li", { class: m.route.get() === route.pathRouter ? "uk-active" : "" }, [
                            m(m.route.Link, {
                                href: route.pathRouter,
                                class: "uk-text-bold uk-text-dark",
                                style: { padding: "10px 15px", whiteSpace: "nowrap" } // Ajuste para que cada ítem ocupe una sola línea
                            }, route.label)
                        ])
                    ),
                    // Links con categoría (submenús)
                    Object.keys(vnode.state.categories).map(category =>
                        m("li.uk-parent", [
                            m("a", { href: "#", class: "uk-text-bold uk-text-dark", style: { padding: "10px 15px", whiteSpace: "nowrap" } }, [
                                ` ${category}`,
                                m("span", { "uk-icon": "icon: triangle-down" })
                            ]),
                            m("div.uk-navbar-dropdown", { style: { padding: "10px 15px" } }, [ // Padding uniforme en submenús
                                m("ul.uk-nav.uk-navbar-dropdown-nav", [
                                    vnode.state.categories[category].map(route =>
                                        m("li", [
                                            m("a", {
                                                onclick: () => Menu.navigateToRoute(route),
                                                class: "uk-text-bold uk-text-dark",
                                                style: { padding: "10px 15px", whiteSpace: "nowrap" }
                                            }, ` ${route.label}`)
                                        ])
                                    )
                                ])
                            ])
                        ])
                    )
                ])
            ]),

            // Offcanvas menu for mobile
            m("div#offcanvas-nav.uk-offcanvas", { "uk-offcanvas": "mode: slide" }, [
                m("div.uk-offcanvas-bar", [
                    m("ul.uk-nav.uk-nav-default", { style: { padding: "10px 15px" } }, [
                        // Links directos (sin categoría)
                        vnode.state.directLinks.map(route =>
                            m("li", { class: m.route.get() === route.pathRouter ? "uk-active" : "" }, [
                                m(m.route.Link, {
                                    href: route.pathRouter,
                                    class: "uk-text-bold uk-text-dark",
                                    onclick: () => {
                                        Menu.navigateToRoute(route);
                                    },
                                    style: { padding: "15px 0", whiteSpace: "nowrap" }
                                }, route.label)
                            ])
                        ),
                        // Links con categoría (submenús)
                        Object.keys(vnode.state.categories).map(category =>
                            m("li.uk-parent", [
                                m("a", { href: "#", class: "uk-text-bold uk-text-dark", style: { padding: "15px 0", whiteSpace: "nowrap" } }, ` ${category}`),
                                m("ul.uk-nav-sub", { style: { padding: "10px 0" } }, [
                                    vnode.state.categories[category].map(route =>
                                        m("li", [
                                            m("a", {
                                                onclick: () => {
                                                    Menu.navigateToRoute(route);
                                                },
                                                class: "uk-text-bold uk-text-dark",
                                                style: { padding: "10px 0", whiteSpace: "nowrap" }
                                            }, ` ${route.label}`)
                                        ])
                                    )
                                ])
                            ])
                        )
                    ])
                ])
            ])
        ]);
    }
};

export default Menu;
