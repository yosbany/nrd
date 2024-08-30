/**
 * Select - Componente para seleccionar una opción de una lista.
 *
 * Props:
 * @param {string} value - El valor seleccionado.
 * @param {Function} onChange - Función que se llama al cambiar la selección.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura.
 * @param {string} label - La etiqueta del campo de selección.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {Array|Function} options - Array de opciones o función para obtener opciones.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo de selección.
 */
const Select = {
    oninit: vnode => {
        vnode.state.loading = true;
        vnode.state.options = [];
        Select.loadOptions(vnode);
    },
    loadOptions: vnode => {
        const { options } = vnode.attrs;

        const standardizeOptions = data => {
            // Transformar cada elemento del array para que tenga la estructura { id: "", display: "" }
            return data.map(option => {
                if (typeof option === 'string') {
                    return { id: option, display: option }; // Si la opción es un string, usarlo como id y display
                } else if (typeof option === 'object' && option !== null) {
                    return { 
                        id: option.id || option.value || "", 
                        display: option.display || option.label || option.name || "" 
                    };
                } else {
                    console.error("[Audit][Select] Invalid option format:", option);
                    return { id: "", display: "Invalid option" };
                }
            });
        };

        if (typeof options === 'function') {
            // Si se proporciona una función, llamar a la función para obtener opciones
            options().then(data => {
                vnode.state.options = standardizeOptions(data || []);
                vnode.state.loading = false;
                m.redraw();
            }).catch(error => {
                console.error("[Audit][Select] Error loading options from function:", error);
                vnode.state.options = [];
                vnode.state.loading = false;
                m.redraw();
            });
        } else if (Array.isArray(options)) {
            // Si se proporciona un array, estandarizarlo
            vnode.state.options = standardizeOptions(options || []);
            vnode.state.loading = false;
            m.redraw();
        } else {
            console.error("[Audit][Select] Invalid options:", options);
            vnode.state.options = [];
            vnode.state.loading = false;
            m.redraw();
        }
    },
    view: vnode => {
        const { value, onChange, outputMode, label, required, documentation, error, showLabel } = vnode.attrs;

        if (vnode.state.loading) {
            return m("div", "Cargando...");
        }

        return m("div.uk-margin", [
            showLabel !== false && m("label", {
                class: `uk-form-label ${required ? "required" : ""}`,
                title: documentation || ""
            }, `${label}:`),
            outputMode 
                ? m("span", value ? value.display : '')
                : m("select", {
                    class: "uk-select",
                    value: value ? value : '',
                    onchange: e => {
                        onChange(e.target.value);
                    }
                }, [
                    m("option", { value: "" }, "Seleccione..."),
                    vnode.state.options.map(option => 
                        m("option", { value: option.id }, option.display)
                    )
                ]),
            error ? m("div.uk-text-danger", { class: "uk-alert-danger" }, error) : null
        ]);
    }
};

export default Select;


