const Text = {
    view: vnode => {
        const { label, documentation, width = '100%', class: additionalClasses = '', ...attrs } = vnode.attrs;

        return m("div", { component: "Text", style: { flexBasis: width } }, [
            m("div", [
                label && m("label.uk-form-label", {
                    title: documentation || ""
                }, `${label}:`),
                m("div.uk-form-controls", [
                    m("input.uk-input", {
                        ...attrs
                    })
                ])
            ])
        ]);
    }
};

export default Text;
