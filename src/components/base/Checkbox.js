const Checkbox = {
    view: ({ attrs }) => {
        const { label, labelPosition = 'left', showLabel = true, labelWidth = 50, ...rest } = attrs;
        const labelWidthClass = `label-width-${labelWidth}`;
        return m('div', { class: 'Checkbox' }, [
            m('div', { class: `label-${labelPosition} align-center` }, [
                m('input[type=checkbox].large-checkbox', rest),
                showLabel && label && m(`label.${labelWidthClass}`, { for: rest.id }, label)
            ])
        ]);
    }
};
export default Checkbox;