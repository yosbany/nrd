/**
 * TextareaInput - Componente para la entrada de texto largo.
 *
 * Props:
 * @param {string} value - El valor del área de texto.
 * @param {Function} onInput - Función que se llama al cambiar el valor.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura.
 * @param {string} label - La etiqueta del área de texto.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {boolean} showLabel - Indica si se debe mostrar el label.
 */
const TextareaInput = {
    view: vnode => {
        const { value, onInput, outputMode, label, required, documentation, error, showLabel = true } = vnode.attrs;

        return m("div", { class: "uk-margin" }, [
            showLabel && m("label", {
                class: `uk-form-label ${required ? "required" : ""}`,
                title: documentation || ""
            }, `${label}:`),
            outputMode
                ? m("span", value)
                : m("textarea", {
                    class: "uk-textarea",
                    value: value || '',
                    oninput: e => onInput(e.target.value)
                }),
            error ? m("div.uk-text-danger", { class: "uk-alert-danger" }, error) : null
        ]);
    }
};

export default TextareaInput;
