/**
 * CheckboxInput - Componente para seleccionar múltiples opciones.
 *
 * Props:
 * @param {Array} value - Las opciones seleccionadas.
 * @param {Function} onInput - Función que se llama al cambiar la selección.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura.
 * @param {string} label - La etiqueta del campo de selección.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {Array|Function} options - Información sobre las opciones o función para obtener opciones.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo.
 */
const CheckboxInput = {
    oninit: vnode => {
        vnode.state.loading = true;
        CheckboxInput.loadOptions(vnode);
    },
    loadOptions: vnode => {
        const { options } = vnode.attrs;

        if (typeof options === 'function') {
            options().then(data => {
                vnode.state.options = data || [];
                vnode.state.loading = false;
                m.redraw();
            }).catch(error => {
                console.error("[Audit][CheckboxInput] Error loading options from function:", error);
                vnode.state.options = [];
                vnode.state.loading = false;
                m.redraw();
            });
        } else if (Array.isArray(options)) {
            vnode.state.options = options || [];
            vnode.state.loading = false;
        } else {
            console.error("[Audit][CheckboxInput] Invalid options:", options);
            vnode.state.options = [];
            vnode.state.loading = false;
        }
    },
    view: vnode => {
        const { value, onInput, outputMode, label, required, documentation, error, showLabel } = vnode.attrs;

        if (vnode.state.loading) {
            return m("div", "Cargando...");
        }

        const handleCheckboxChange = (optionValue, isChecked) => {
            const updatedValue = Array.isArray(value) ? [...value] : [];
            if (isChecked) {
                updatedValue.push(optionValue);
            } else {
                const index = updatedValue.indexOf(optionValue);
                if (index !== -1) {
                    updatedValue.splice(index, 1);
                }
            }
            onInput(updatedValue);
        };

        return m("div.uk-margin", [
            showLabel !== false && m("label.uk-form-label", {
                class: required ? "uk-text-danger" : "",
                title: documentation || ""
            }, `${label}:`),
            vnode.state.options.map(option => {
                const optionLabel = typeof option === 'object' && option !== null
                    ? (option.label || option.name || JSON.stringify(option))
                    : option;
                const optionValue = option.id || option;
                const isChecked = Array.isArray(value) ? value.includes(optionValue) : false;

                return m("div.uk-form-controls", { style: { display: 'block', marginRight: '10px' } }, [
                    m("label", [
                        m("input[type=checkbox].uk-checkbox", {
                            checked: isChecked,
                            onclick: e => handleCheckboxChange(optionValue, e.target.checked)
                        }),
                        m("span", { style: { marginLeft: '10px' } }, optionLabel)
                    ])
                ]);
            }),
            error ? m("div.uk-text-danger", error) : null
        ]);
    }
};

export default CheckboxInput;
