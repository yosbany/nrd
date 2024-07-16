const SearchInput = {
    view: (vnode) => {
        return m('input', {
            type: 'text',
            placeholder: vnode.attrs.placeholder || 'Buscar...',
            oninput: vnode.attrs.oninput,
            class: 'search-input'
        });
    }
};

export default SearchInput;
