export const Select = {
    view: ({ attrs, children }) => {
        return m('select', { class: 'u-full-width', ...attrs }, children);
    }
};
