const FilterSelect = {
    oninit: vnode => {
        vnode.state.loading = true;
        vnode.state.options = [];
        vnode.state.filteredOptions = [];
        vnode.state.searchText = "";              // Almacena el texto de búsqueda introducido por el usuario.
        vnode.state.showSelect = false;
        vnode.state.selectedDisplay = "";         // Almacena el texto seleccionado.

        console.log("[FilterSelect] Initial value:", vnode.attrs.value);

        FilterSelect.loadOptions(vnode);
    },

    onupdate: vnode => {
        const { value } = vnode.attrs;
        if (value && !vnode.state.loading && vnode.state.options.length > 0) {
            const defaultOption = vnode.state.options.find(option => option.id === value);
            if (defaultOption && vnode.state.selectedDisplay !== defaultOption.display) {
                vnode.state.selectedDisplay = defaultOption.display;
                vnode.state.searchText = defaultOption.display; // Actualizar searchText solo cuando se selecciona una opción
                console.log("[FilterSelect] Updated selected display for value:", value);
                m.redraw(); // Redibujar si el display seleccionado cambia
            }
        }
    },

    loadOptions: vnode => {
        const { options, value } = vnode.attrs;

        console.log("[FilterSelect] Loading options...");

        const standardizeOptions = data => {
            return data.map(option => {
                if (typeof option === 'string') {
                    return { id: option, display: option }; 
                } else if (typeof option === 'object' && option !== null) {
                    return { 
                        id: option.id || option.value || "", 
                        display: option.display || option.label || option.name || "" 
                    };
                } else {
                    console.error("[FilterSelect] Invalid option format:", option);
                    return { id: "", display: "Invalid option" };
                }
            });
        };

        if (typeof options === 'function') {
            options().then(data => {
                vnode.state.options = standardizeOptions(data || []);
                vnode.state.filteredOptions = vnode.state.options;
                vnode.state.loading = false;

                console.log("[FilterSelect] Options loaded:", vnode.state.options);

                const defaultOption = vnode.state.options.find(option => option.id === value);
                if (defaultOption) {
                    vnode.state.selectedDisplay = defaultOption.display;
                    vnode.state.searchText = defaultOption.display;
                    console.log("[FilterSelect] Found matching option on load:", defaultOption);
                }
                m.redraw();
            }).catch(error => {
                console.error("[FilterSelect] Error loading options from function:", error);
                vnode.state.options = [];
                vnode.state.filteredOptions = [];
                vnode.state.loading = false;
                m.redraw();
            });
        } else if (Array.isArray(options)) {
            vnode.state.options = standardizeOptions(options || []);
            vnode.state.filteredOptions = vnode.state.options;
            vnode.state.loading = false;

            console.log("[FilterSelect] Options loaded:", vnode.state.options);

            const defaultOption = vnode.state.options.find(option => option.id === value);
            if (defaultOption) {
                vnode.state.selectedDisplay = defaultOption.display;
                vnode.state.searchText = defaultOption.display;
                console.log("[FilterSelect] Found matching option on load:", defaultOption);
            }
            m.redraw();
        } else {
            console.error("[FilterSelect] Invalid options:", options);
            vnode.state.options = [];
            vnode.state.filteredOptions = [];
            vnode.state.loading = false;
            m.redraw();
        }
    },

    filterOptions: vnode => {
        const searchTextLower = vnode.state.searchText.toLowerCase();
        vnode.state.filteredOptions = vnode.state.options.filter(option =>
            option.display.toLowerCase().includes(searchTextLower)
        );

        console.log("[FilterSelect] Filtered options:", vnode.state.filteredOptions);

        vnode.state.showSelect = true;
    },

    handleInputChange: (vnode, e) => {
        vnode.state.searchText = e.target.value;
        console.log("[FilterSelect] Search text changed:", vnode.state.searchText);
        FilterSelect.filterOptions(vnode);
    },

    handleOptionSelect: (vnode, option) => {
        vnode.state.selectedDisplay = option.display;
        vnode.state.searchText = option.display;
        vnode.attrs.onChange(option.id);
        vnode.state.showSelect = false;
        console.log("[FilterSelect] Option selected:", option);
    },

    view: vnode => {
        const { label, required, documentation, error, showLabel } = vnode.attrs;

        if (vnode.state.loading) {
            return m("div", "Cargando...");
        }

        return m("div.uk-margin", [
            showLabel !== false && m("label", {
                class: `uk-form-label ${required ? "required" : ""}`,
                title: documentation || ""
            }, `${label}:`),
            m("div.uk-inline.uk-width-1-1", [
                m("span.uk-form-icon", { "uk-icon": "icon: search" }),
                m("input.uk-input.uk-width-1-1", {
                    type: "text",
                    placeholder: vnode.attrs.placeholder || "Buscar...",
                    value: vnode.state.searchText, // Usar searchText directamente
                    oninput: e => FilterSelect.handleInputChange(vnode, e),
                    onfocus: () => vnode.state.showSelect = true,
                    onblur: () => {
                        setTimeout(() => { vnode.state.showSelect = false; m.redraw(); }, 100);
                    }
                }),
                vnode.state.showSelect && vnode.state.filteredOptions.length > 0 && m("div", {
                    style: {
                        position: 'absolute',
                        zIndex: 1000,
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        width: '100%' // Para asegurar que se adapte al ancho del input en pantallas pequeñas
                    }
                }, [
                    m("ul.uk-list", 
                        vnode.state.filteredOptions.map(option =>
                            m("li", {
                                class: "uk-selectable", 
                                style: { padding: '8px', cursor: 'pointer' },
                                onclick: () => FilterSelect.handleOptionSelect(vnode, option)
                            }, option.display)
                        )
                    )
                ])
            ]),
            error ? m("div.uk-text-danger", { class: "uk-alert-danger" }, error) : null
        ]);
    }
};

export default FilterSelect;
