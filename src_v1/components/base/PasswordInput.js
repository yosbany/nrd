/**
 * PasswordInput - Componente para la entrada de contraseñas.
 *
 * Props:
 * @param {string} value - El valor del campo de entrada de contraseña.
 * @param {Function} oninput - Función que se llama al cambiar el valor.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura (oculto).
 * @param {string} label - La etiqueta del campo de entrada.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo de entrada.
 */
const PasswordInput = {
    view: vnode => {
        const { value, oninput, outputMode, label, required, documentation, error, showLabel } = vnode.attrs;

        return m("div.uk-margin", [
            showLabel !== false && m("label.uk-form-label", {
                class: required ? "uk-text-danger" : "",
                title: documentation || ""
            }, `${label}:`),
            outputMode
                ? m("span", "••••••••")
                : m("input.uk-input[type=password]", {
                    value: value || '',
                    oninput: e => oninput(e.target.value)
                }),
            error ? m("div.uk-text-danger.uk-alert-danger", error) : null
        ]);
    }
};

export default PasswordInput;
