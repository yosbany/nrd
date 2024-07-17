const HorizontalLayout = {
    view: ({ attrs, children }) => {
        const { columns = [], className = '', ...rest } = attrs;
        return m('div', { class: `row ${className}`, ...rest }, 
            children.map((child, index) => 
                m('div', { class: `${columns[index] || 'twelve'} columns` }, child)
            )
        );
    }
};
export default HorizontalLayout;