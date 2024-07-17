export const InputNumber = {
    view: ({ attrs }) => {
        return m('input[type=number]', { class: 'u-full-width', ...attrs });
    }
};
