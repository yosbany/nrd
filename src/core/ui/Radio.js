/**
 * Radio - Componente para seleccionar una opción entre varias.
 *
 * Props:
 * @param {string} value - El valor seleccionado.
 * @param {Function} onInput - Función que se llama al cambiar la selección.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura.
 * @param {string} label - La etiqueta del campo de selección.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {Array|Function} options - Array de opciones o función para obtener opciones.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo de selección.
 */
const Radio = {
    oninit: vnode => {
        vnode.state.loading = true;
        Radio.loadOptions(vnode);
    },
    loadOptions: vnode => {
        const { options } = vnode.attrs;

        if (typeof options === 'function') {
            // Si se proporciona una función, llamar a la función para obtener opciones
            options().then(data => {
                vnode.state.options = data || [];
                vnode.state.loading = false;
                m.redraw();
            }).catch(error => {
                console.error("[Audit][RadioInput] Error loading options from function:", error);
                vnode.state.options = [];
                vnode.state.loading = false;
                m.redraw();
            });
        } else if (Array.isArray(options)) {
            // Si se proporciona un array, usarlo directamente
            vnode.state.options = options || [];
            vnode.state.loading = false;
        } else {
            console.error("[Audit][RadioInput] Invalid options:", options);
            vnode.state.options = [];
            vnode.state.loading = false;
        }
    },
    view: vnode => {
        const { value, onInput, outputMode, label, required, documentation, error, showLabel } = vnode.attrs;

        if (vnode.state.loading) {
            return m("div", "Cargando...");
        }

        return m("div.uk-margin", [
            showLabel !== false && m("label", {
                class: `uk-form-label ${required ? "required" : ""}`,
                title: documentation || ""
            }, `${label}:`),
            outputMode
                ? m("span", value)
                : (vnode.state.options || []).map(option => m("div.uk-margin-small", [
                    m("label.uk-form-label.uk-margin-small-right", [
                        m("input.uk-radio[type=radio]", {
                            name: label,
                            value: option,
                            checked: value === option,
                            onclick: e => onInput(e.target.value)
                        }),
                        ` ${option}`
                    ])
                ])),
            error ? m("div.uk-text-danger.uk-alert-danger", error) : null
        ]);
    }
};

export default Radio;
