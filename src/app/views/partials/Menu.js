import MainController from '../../controllers/MainController.js';

const Menu = {
    oninit: () => {
        MainController.initializeMenu();
    },

    view: () => {
        return m("nav.uk-navbar-container.uk-background-primary", { "uk-navbar": "" }, [
            m("div.uk-navbar-left", [
                m("a.uk-navbar-toggle.uk-hidden@m", { 
                    "uk-navbar-toggle-icon": "", 
                    "uk-toggle": "target: #offcanvas-nav",
                    style: { marginLeft: "8px" } 
                }),
                m("div.uk-navbar-item.uk-logo", { style: { marginLeft: "20px" } }, "NUEVA RÍO D'OR v2.0.5")
            ]),
            m("div.uk-navbar-right.uk-visible@m", [
                m("ul.uk-navbar-nav", { style: { padding: "0 15px" } }, [
                    MainController.directLinks.map(route =>
                        m("li", { class: m.route.get() === route.pathRouter ? "uk-active" : "" }, [
                            m(m.route.Link, {
                                href: route.pathRouter,
                                class: "uk-text-bold uk-text-dark",
                                style: { padding: "10px 15px", whiteSpace: "nowrap" } 
                            }, route.label)
                        ])
                    ),
                    Object.keys(MainController.categories).map(category =>
                        m("li.uk-parent", [
                            m("a", { href: "#", class: "uk-text-bold uk-text-dark", style: { padding: "10px 15px", whiteSpace: "nowrap" } }, [
                                ` ${category}`,
                                m("span", { "uk-icon": "icon: triangle-down" })
                            ]),
                            m("div.uk-navbar-dropdown", { style: { padding: "10px 15px" } }, [
                                m("ul.uk-nav.uk-navbar-dropdown-nav", [
                                    MainController.categories[category].map(route =>
                                        m("li", [
                                            m("a", {
                                                onclick: () => MainController.navigateToRoute(route),
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

            m("div#offcanvas-nav.uk-offcanvas", { "uk-offcanvas": "mode: slide" }, [
                m("div.uk-offcanvas-bar", [
                    m("ul.uk-nav.uk-nav-default", { style: { padding: "10px 15px" } }, [
                        MainController.directLinks.map(route =>
                            m("li", { class: m.route.get() === route.pathRouter ? "uk-active" : "" }, [
                                m(m.route.Link, {
                                    href: route.pathRouter,
                                    class: "uk-text-bold uk-text-dark",
                                    onclick: () => {
                                        MainController.navigateToRoute(route);
                                    },
                                    style: { padding: "15px 0", whiteSpace: "nowrap" }
                                }, route.label)
                            ])
                        ),
                        Object.keys(MainController.categories).map(category =>
                            m("li.uk-parent", [
                                m("a", { href: "#", class: "uk-text-bold uk-text-dark", style: { padding: "15px 0", whiteSpace: "nowrap" } }, ` ${category}`),
                                m("ul.uk-nav-sub", { style: { padding: "10px 0" } }, [
                                    MainController.categories[category].map(route =>
                                        m("li", [
                                            m("a", {
                                                onclick: () => {
                                                    MainController.navigateToRoute(route);
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
