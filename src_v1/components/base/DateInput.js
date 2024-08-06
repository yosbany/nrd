/**
 * DateInput - Componente para la selección de fechas.
 *
 * Props:
 * @param {string} value - El valor del campo de fecha.
 * @param {Function} onInput - Función que se llama al cambiar la fecha.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura.
 * @param {string} label - La etiqueta del campo de fecha.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo.
 */
const DateInput = {
    view: vnode => {
        const { value, onInput, outputMode, label, required, documentation, error, showLabel } = vnode.attrs;

        return m("div", [
            showLabel !== false && m("label", {
                class: required ? "required" : "",
                title: documentation || ""
            }, `${label}:`),
            outputMode
                ? m("span", value)
                : m("input[type=date]", {
                    value: value || '',
                    oninput: e => onInput(e.target.value)
                }),
            error ? m("div.error", error) : null
        ]);
    }
};

export default DateInput;
