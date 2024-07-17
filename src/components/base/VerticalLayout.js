const VerticalLayout = {
    view: ({ attrs, children }) => {
        const { className = '', ...rest } = attrs;
        return m('div', { class: `${className}`, ...rest }, children);
    }
};

export default VerticalLayout;