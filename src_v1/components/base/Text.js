/**
 * Text - Componente para la entrada de texto.
 *
 * Props:
 * @param {string} value - El valor del campo de entrada.
 * @param {Function} onInput - Función que se llama al cambiar el valor.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura.
 * @param {string} label - La etiqueta del campo de entrada.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {boolean} showLabel - Indica si se debe mostrar el label.
 * @param {string} placeholder - Texto que se muestra cuando el campo está vacío.
 */
const Text = {
    view: vnode => {
        const { value, onInput, outputMode, label, required, documentation, error, showLabel = true, placeholder } = vnode.attrs;

        return m("div.uk-margin", [
            showLabel && m("label.uk-form-label", {
                class: required ? "uk-text-danger" : "",
                title: documentation || ""
            }, label),
            outputMode
                ? m("div.uk-form-controls", [
                    m("span.uk-text-emphasis", value)
                  ])
                : m("div.uk-form-controls", [
                    m("input.uk-input", {
                        type: "text",
                        value: value || '',
                        oninput: e => onInput(e.target.value),
                        placeholder: placeholder || ''
                    })
                  ]),
            error && m("div.uk-text-danger", error)
        ]);
    }
};

export default Text;
