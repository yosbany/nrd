const Breadcrumb = {
    view: vnode => {
        const { items } = vnode.attrs;

        if (!Array.isArray(items) || items.length === 0) {
            console.warn("[Audit][Breadcrumb] No items provided or items is not an array");
            return null;
        }

        return m("nav", { "aria-label": "Breadcrumb" }, [
            m("ul.uk-breadcrumb", 
                items.map((item, index) => 
                    m("li", { class: item.disabled ? 'uk-disabled' : '' }, [
                        item.path && !item.disabled ? 
                            m("a", {
                                href: item.path,
                                style: { fontWeight: 'bold' }, // Negrita para enlaces
                                oncreate: m.route.link,
                                onclick: e => {
                                    e.preventDefault();
                                    m.route.set(item.path);
                                }
                            }, item.name) :
                            (item.current ? 
                                m("span", { "aria-current": "page", style: { fontWeight: 'bold' } }, item.name) : // Negrita para el elemento actual
                                m("a", { style: { cursor: 'default', fontWeight: 'bold' } }, item.name) // Negrita para elementos deshabilitados
                            )
                    ])
                )
            )
        ]);
    }
};

export default Breadcrumb;
