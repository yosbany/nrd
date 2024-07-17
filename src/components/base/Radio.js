const Radio = {
    view: ({ attrs }) => {
        const { label, labelPosition = 'left', showLabel = true, labelWidth = 50, ...rest } = attrs;
        const labelWidthClass = `label-width-${labelWidth}`;
        return m('div', { class: 'Radio' }, [
            m('div', { class: `label-${labelPosition} align-center` }, [
                m('input[type=radio].large-radio', rest),
                showLabel && label && m(`label.${labelWidthClass}`, { for: rest.id }, label)
            ])
        ]);
    }
};
export default Radio;