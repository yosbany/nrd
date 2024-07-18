const Menu = {
    view: function() {
        return m("div.pure-menu.pure-menu-horizontal.pure-menu-scrollable", [
            m("a.pure-menu-heading", { href: "#", onclick: () => m.route.set("/items") }, "MyApp"),
            m("ul.pure-menu-list", [
                m("li.pure-menu-item", m("a.pure-menu-link", { href: "#", onclick: () => m.route.set("/items") }, "Items")),
                m("li.pure-menu-item", m("a.pure-menu-link", { href: "#", onclick: () => m.route.set("/create") }, "Create Item"))
            ])
        ]);
    }
};

export default Menu;
