export const Select = {
    view: ({ attrs, children }) => {
        const { label, labelPosition = 'top', showLabel = true, labelWidth = 50, ...rest } = attrs;
        const labelWidthClass = `label-width-${labelWidth}`;
        return m('div', { class: 'Select' }, [
            m('div', { class: `label-${labelPosition}` }, [
                showLabel && label && m(`label.${labelWidthClass}`, { for: rest.id }, label),
                m('select', { class: 'u-full-width', ...rest }, children)
            ])
        ]);
    }
};
