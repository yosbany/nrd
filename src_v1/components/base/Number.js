/**
 * Number - Componente para la entrada de números y salida formateada.
 *
 * Props:
 * @param {number} value - El valor del campo de entrada numérica.
 * @param {Function} onInput - Función que se llama al cambiar el valor.
 * @param {Function} onFocus - Función que se llama cuando el campo toma el foco.
 * @param {Function} onBlur - Función que se llama cuando el campo pierde el foco.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura.
 * @param {string} label - La etiqueta del campo de entrada.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo de entrada.
 * @param {string} format - Formato de salida: "integer", "decimal", "currency".
 */
const Number = {
    view: vnode => {
        const { value, onInput, onFocus, onBlur, outputMode, label, required, documentation, error, showLabel = true, format = "decimal", ...otherAttrs } = vnode.attrs;

        // Función para formatear el número basado en el formato proporcionado
        const formatNumber = (value, format) => {
            if (value == null) {
                return ''; // Mostrar vacío si el valor es undefined o null
            }

            const options = {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            };

            if (format === "integer") {
                return parseInt(value, 10).toLocaleString('es-ES'); // Formato entero
            } else if (format === "decimal") {
                return parseFloat(value).toLocaleString('es-ES', options); // Formato decimal con dos decimales
            } else if (format === "currency") {
                return "$ " + parseFloat(value).toLocaleString('es-ES', options); // Formato moneda
            }

            return value; // Retornar sin formato si no se especifica un formato válido
        };

        return m("div.uk-margin", [
            showLabel && m("label.uk-form-label", {
                class: required ? "uk-text-danger" : "",
                title: documentation || ""
            }, `${label}:`),
            outputMode
                ? m("div.uk-form-controls", [
                    m("span.uk-text-emphasis", formatNumber(value, format))
                  ])
                : m("div.uk-form-controls", [
                    m("input.uk-input[type=number]", {
                        value: value != null ? value : '', // Mostrar valor vacío si no está definido
                        oninput: e => onInput(parseFloat(e.target.value) || 0), // Convertir a número, usar 0 si es NaN
                        onfocus: onFocus, // Pasar el evento onFocus
                        onblur: onBlur, // Pasar el evento onBlur
                        placeholder: "", // Placeholder vacío para consistencia con TextInput
                        ...otherAttrs // Pasar los demás atributos al input
                    })
                  ]),
            error && m("div.uk-text-danger.uk-alert-danger", error)
        ]);
    }
};

export default Number;
