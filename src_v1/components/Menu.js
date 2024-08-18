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
        });
    },

    view: vnode => {
        console.log("[Audit][Menu] Rendering Menu view...");

        console.log("[Audit][Menu] Categorized routes:", vnode.state.categories);
        console.log("[Audit][Menu] Direct links:", vnode.state.directLinks);

        return m("nav", { class: "uk-padding-small" }, [
            m("ul.uk-tab", [
                // Links directos (sin categoría)
                vnode.state.directLinks.map(route =>
                    m("li", { class: m.route.get() === route.pathRouter ? "uk-active" : "" }, [
                        m(m.route.Link, {
                            href: route.pathRouter,
                            class: "uk-text-bold uk-text-dark" // Texto negrita y oscuro (negro)
                        }, route.label)
                    ])
                ),
                // Links con categoría (submenús)
                Object.keys(vnode.state.categories).map(category =>
                    m("li", { class: "uk-parent" }, [
                        m("a", {
                            href: "#",
                            class: "uk-text-bold uk-text-dark" // Texto negrita y oscuro (negro)
                        }, [
                            ` ${category}`,
                            m("span", { "uk-icon": "icon: triangle-down" })
                        ]),
                        m("div", { "uk-dropdown": "mode: click; pos: bottom-justify" }, [
                            m("ul.uk-nav uk-dropdown-nav", [
                                vnode.state.categories[category].map(route =>
                                    m("li", [
                                        m("a", {
                                            onclick: () => Menu.navigateToRoute(route),
                                            class: "uk-text-bold uk-text-dark" // Texto negrita y oscuro (negro)
                                        }, ` ${route.label}`)
                                    ])
                                )
                            ])
                        ])
                    ])
                )
            ])
        ]);
    }
};

export default Menu;
