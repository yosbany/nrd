export const HorizontalLayout = {
    view: ({ attrs, children }) => {
        return m('div', { class: 'row', ...attrs }, children);
    }
};
