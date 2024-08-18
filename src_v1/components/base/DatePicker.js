/**
 * DatePicker - Componente para la selección de fechas.
 *
 * Props:
 * @param {string} value - El valor del campo de fecha en formato "YYYY-MM-DD".
 * @param {Function} onInput - Función que se llama al cambiar la fecha.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura.
 * @param {string} label - La etiqueta del campo de fecha.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo.
 */


const DatePicker = {
    view: vnode => {
        const { value, onInput, outputMode, label, required, documentation, error, showLabel } = vnode.attrs;

        // Función para convertir la fecha a formato "DD-MM-YYYY"
        const formatDateDisplay = date => {
            if (!date) return '';
            const d = new Date(date);
            const day = (`0${d.getUTCDate()}`).slice(-2);  // Día en formato DD
            const month = (`0${d.getUTCMonth() + 1}`).slice(-2); // Mes en formato MM
            const year = d.getUTCFullYear(); // Año en formato YYYY
            return `${day}-${month}-${year}`;
        };

        // Función para convertir la fecha a formato "YYYY-MM-DD"
        const formatDateInput = date => {
            if (!date) return '';
            const d = new Date(date);
            const year = d.getUTCFullYear();
            const month = (`0${d.getUTCMonth() + 1}`).slice(-2); // Mes en formato MM
            const day = (`0${d.getUTCDate()}`).slice(-2); // Día en formato DD
            return `${year}-${month}-${day}`;
        };

        return m("div.uk-margin", [
            showLabel !== false && m("label.uk-form-label", {
                class: required ? "uk-text-danger" : "",
                title: documentation || ""
            }, `${label}:`),
            outputMode
                ? m("span.uk-text-emphasis", formatDateDisplay(value))
                : m("input.uk-input[type=date]", {
                    value: formatDateInput(value),
                    oninput: e => {
                        const [year, month, day] = e.target.value.split('-').map(Number);
                        const dateValue = new Date(Date.UTC(year, month - 1, day));
                        onInput(dateValue);
                    },
                    class: error ? "uk-form-danger" : ""
                }),
            error ? m("div.uk-text-danger", error) : null
        ]);
    }
};

export default DatePicker;
