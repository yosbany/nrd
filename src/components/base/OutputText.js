const OutputText = {
    view: (vnode) => {
        return m('div', { class: 'output-text' }, vnode.attrs.text);
    }
};

export default OutputText;
