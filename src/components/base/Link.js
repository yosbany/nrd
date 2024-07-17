const Link = {
    view: ({ attrs, children }) => {
        const { label, href, labelPosition = 'left', showLabel = true, labelWidth = 50, ...rest } = attrs;
        const labelWidthClass = `label-width-${labelWidth}`;
        return m('div', { class: 'Link' }, [
            m('div', { class: `label-${labelPosition}` }, [
                showLabel && label && m(`label.${labelWidthClass}`, { for: rest.id }, label),
                m(m.route.Link, { href, ...rest }, children)
            ])
        ]);
    }
};
export default Link;