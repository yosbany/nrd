const Number = {
    handleFocusAndBlur: vnode => {
        if (!vnode.attrs.outputMode) {  // Solo agregar eventos si no está en modo de solo lectura
            const inputElement = vnode.dom.querySelector("input[type=number]");
            
            if (inputElement) {  // Verificar si el elemento input existe
                // Guardar el valor original
                let originalValue = inputElement.value;

                inputElement.addEventListener('focus', function() {
                    originalValue = this.value;  // Guardar el valor antes de vaciar
                    setTimeout(() => {
                        this.value = ''; // Vaciar el valor al enfocar
                    }, 0);
                });

                inputElement.addEventListener('blur', function() {
                    if (this.value === '') {
                        this.value = originalValue || vnode.attrs.value || 0;  // Restaurar el valor original o el valor predeterminado si está vacío
                        vnode.attrs.onInput(parseFloat(this.value) || 0);  // Actualizar el estado con el valor restaurado
                        m.redraw();  // Forzar un redibujado para reflejar el cambio
                    }
                });
            }
        }
    },

    oncreate: vnode => {
        Number.handleFocusAndBlur(vnode);
    },

    onupdate: vnode => {
        Number.handleFocusAndBlur(vnode);
    },

    view: vnode => {
        const { value, onInput, onFocus, onBlur, outputMode, label, required, documentation, error, showLabel = true, format = "decimal", ...attrs } = vnode.attrs;

        // Función para formatear el número basado en el formato proporcionado
        const formatNumber = (value, format) => {
            if (value == null) {
                return '';  // Mostrar vacío si el valor es undefined o null
            }

            const options = {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            };

            if (format === "integer") {
                return parseInt(value, 10).toLocaleString('es-ES');  // Formato entero
            } else if (format === "decimal") {
                return parseFloat(value).toLocaleString('es-ES', options);  // Formato decimal con dos decimales
            } else if (format === "currency") {
                return "$ " + parseFloat(value).toLocaleString('es-ES', options);  // Formato moneda
            }

            return value;  // Retornar sin formato si no se especifica un formato válido
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
                        value: value != null ? value : '',  // Mostrar valor vacío si no está definido
                        oninput: e => onInput(parseFloat(e.target.value) || 0),  // Convertir a número, usar 0 si es NaN
                        onfocus: onFocus || function() {},  // Usar la función predeterminada si no se proporciona
                        onblur: onBlur || function() {},  // Usar la función predeterminada si no se proporciona
                        placeholder: "",  // Placeholder vacío para consistencia con TextInput
                        ...attrs  // Pasar los demás atributos al input
                    })
                  ]),
            error && m("div.uk-text-danger.uk-alert-danger", error)
        ]);
    }
};

export default Number;
