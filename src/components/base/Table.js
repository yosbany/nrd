export const Table = {
    view: ({ attrs, children }) => {
        return m('table', { class: 'u-full-width', ...attrs }, children);
    }
};
