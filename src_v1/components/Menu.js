import SecurityModel from '../models/SecurityModel.js';
import Entities from '../config/Entities.js';


const Menu = {
    navigateToEntity: (entity) => {
        if (SecurityModel.hasAccessToEntity(entity)) {
            console.log("[Audit][Menu] Navigating to entity:", entity);
            m.route.set(`/${entity}`);
        } else {
            console.log("[Audit][Menu] User does not have access to the entity:", entity);
            m.route.set('/unauthorized');
        }

        // Cerrar todos los dropdowns abiertos
        const dropdowns = document.querySelectorAll('.uk-dropdown');
        dropdowns.forEach(dropdown => {
            UIkit.dropdown(dropdown).hide();
        });
    },

    view: vnode => {
        console.log("[Audit][Menu] Rendering Menu view...");

        const categories = {};

        // Agrupar entidades por categoría y filtrar por permisos
        Object.keys(Entities).forEach(entity => {
            if (SecurityModel.hasAccessToEntity(entity)) {
                const category = Entities[entity].category || 'Sin Categoría';
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(entity);
            }
        });

        console.log("[Audit][Menu] Categorized entities:", categories);

        return m("nav", { class: "uk-padding-small" }, [
            m("ul.uk-tab", [
                m("li", { class: m.route.get() === "/home" ? "uk-active" : "" }, [
                    m(m.route.Link, {
                        href: "/home",
                        class: "uk-text-bold uk-text-dark" // Texto negrita y oscuro (negro)
                    }, "Inicio")
                ]),
                Object.keys(categories).map(category => 
                    m("li", [
                        m("a", {
                            href: "#",
                            class: "uk-text-bold uk-text-dark" // Texto negrita y oscuro (negro)
                        }, [
                            ` ${category}`,
                            m("span", { "uk-icon": "icon: triangle-down" })
                        ]),
                        m("div", { "uk-dropdown": "mode: click" }, [
                            m("ul.uk-nav uk-dropdown-nav", [
                                categories[category].map(entity =>
                                    m("li", [
                                        m("a", {
                                            onclick: () => Menu.navigateToEntity(entity),
                                            class: "uk-text-bold uk-text-dark" // Texto negrita y oscuro (negro)
                                        }, ` ${Entities[entity].label}`)
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
