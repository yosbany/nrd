const InputNumber = {
    view: ({ attrs }) => {
        const { label, labelPosition = 'top', showLabel = true, labelWidth = 50, ...rest } = attrs;
        const labelWidthClass = `label-width-${labelWidth}`;
        return m('div', { class: 'InputNumber' }, [
            m('div', { class: `label-${labelPosition}` }, [
                showLabel && label && m(`label.${labelWidthClass}`, { for: rest.id }, label),
                m('input[type=number]', { class: 'u-full-width', ...rest })
            ])
        ]);
    }
};
export default InputNumber;