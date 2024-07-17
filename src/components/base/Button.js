export const Button = {
    view: ({ attrs, children }) => {
        return m('button', { class: 'button-primary', ...attrs }, children);
    }
};
