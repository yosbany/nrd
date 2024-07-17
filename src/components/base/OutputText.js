const OutputText = {
    view: ({ attrs, children }) => {
        const { label, labelPosition = 'top', showLabel = true, labelWidth = 50, ...rest } = attrs;
        const labelWidthClass = `label-width-${labelWidth}`;
        return m('div', { class: 'OutputText' }, [
            m('div', { class: `label-${labelPosition}` }, [
                showLabel && label && m(`label.${labelWidthClass}`, { for: rest.id }, label),
                m('span', rest, children)
            ])
        ]);
    }
};
export default OutputText;