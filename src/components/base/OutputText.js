const OutputText = {
    view: ({ attrs }) => {
        const { label, labelPosition = 'top', showLabel = true, labelWidth = 50, text } = attrs;
        const labelClass = `label-${labelPosition}`;
        const labelStyle = labelWidth ? `width: ${labelWidth}%` : '';
        return m('div', { class: 'output-text' }, [
            showLabel && label && m('label', { class: labelClass, style: labelStyle }, label),
            m('span', text)
        ]);
    }
};

export default OutputText;
