/**
 * FileInput - Componente para la subida de archivos.
 *
 * Props:
 * @param {string} value - El contenido del archivo en base64.
 * @param {Function} onInput - Función que se llama al cambiar el archivo.
 * @param {boolean} outputMode - Si es true, muestra el valor en modo de solo lectura.
 * @param {string} label - La etiqueta del campo de subida de archivos.
 * @param {boolean} required - Indica si el campo es obligatorio.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {string} error - Mensaje de error, si existe.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo.
 */
const FileInput = {
    view: vnode => {
        const { value, onInput, outputMode, label, required, documentation, error, showLabel } = vnode.attrs;

        return m("div.uk-margin-small", [
            showLabel !== false && m("label.uk-form-label", {
                class: required ? "uk-text-danger" : "",
                title: documentation || ""
            }, `${label}:`),
            outputMode
                ? value
                    ? m("img", { src: `data:image/*;base64,${value}`, style: { width: '30px', height: '30px' } })
                    : m("span.uk-text-muted", "No hay archivo")
                : [
                    m("div.uk-form-custom", [
                        m("input[type=file]", {
                            onchange: e => {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onload = () => onInput(reader.result.split(',')[1]);
                                reader.readAsDataURL(file);
                            }
                        }),
                        m("button.uk-button.uk-button-default", "Seleccionar archivo")
                    ]),
                    value ? m("img", { src: `data:image/*;base64,${value}`, style: { width: '30px', height: '30px', marginTop: '10px' } }) : null
                ],
            error ? m("div.uk-text-danger", error) : null
        ]);
    }
};

export default FileInput;
