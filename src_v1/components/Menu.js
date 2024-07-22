import SecurityModel from '../models/SecurityModel.js';
import Entities from '../config/Entities.js';

const Menu = {
    oninit: vnode => {
        console.log("[Audit] Initializing Menu component...");
        vnode.state.showContextMenu = {}; // Estado para controlar la visibilidad del menú de contexto por categoría
        
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.context-menu') && !event.target.closest('.category-link')) {
                console.log("[Audit] Clicked outside context menu or category link, hiding all context menus.");
                vnode.state.showContextMenu = {};
                m.redraw();
            }
        });
    },
    toggleContextMenu: (vnode, category) => {
        vnode.state.showContextMenu[category] = !vnode.state.showContextMenu[category];
        console.log("[Audit] Toggling context menu for category:", category, "Visible:", vnode.state.showContextMenu[category]);
    },
    navigateToEntity: (vnode, entity) => {
        if (SecurityModel.hasAccessToEntity(entity)) {
            console.log("[Audit] Navigating to entity:", entity);
            vnode.state.showContextMenu = {};
            m.route.set(`/${entity}`);
        } else {
            console.log("[Audit] User does not have access to the entity:", entity);
            m.route.set('/unauthorized');
        }
    },
    view: vnode => {
        console.log("[Audit] Rendering Menu view...");

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

        console.log("[Audit] Categorized entities:", categories);

        return m("nav", [
            m(m.route.Link, { href: "/home", class: "menu-link" }, "Inicio"),
            Object.keys(categories).map(category =>
                categories[category].length > 0 && m("div.menu-category", { style: { position: 'relative' } }, [
                    m("a.category-link.menu-link", {
                        onclick: (e) => {
                            e.stopPropagation();
                            Menu.toggleContextMenu(vnode, category);
                        }
                    }, category),
                    vnode.state.showContextMenu[category] && m("div.context-menu", [
                        categories[category].map(entity =>
                            m("a.context-menu-item", {
                                onclick: () => Menu.navigateToEntity(vnode, entity)
                            }, Entities[entity].label)
                        )
                    ])
                ])
            )
        ]);
    }
};

export default Menu;
