const OutputText = {
    view: (vnode) => {
        return m('p', { class: 'form-control-plaintext' }, vnode.attrs.text);
    }
};

export default OutputText;
