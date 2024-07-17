export const VerticalLayout = {
    view: ({ attrs, children }) => {
        return m('div', { class: 'container', ...attrs }, children);
    }
};
