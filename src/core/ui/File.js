const File = {
    oninit: vnode => {
        vnode.state.isUploading = false; // Estado para controlar la carga del archivo
        vnode.state.fileName = ""; // Estado para almacenar el nombre del archivo
        vnode.state.isImage = false; // Estado para determinar si el archivo es una imagen
    },

    view: vnode => {
        const { value, onInput, onRemove, outputMode, label, required, documentation, error, showLabel } = vnode.attrs;

        return m("div.uk-margin-small", [
            showLabel !== false && m("label.uk-form-label", {
                class: required ? "uk-text-danger" : "",
                title: documentation || ""
            }, `${label}:`),

            outputMode
                ? value
                    ? m("div", [
                        vnode.state.isImage
                            ? m("img", { src: `data:image/*;base64,${value}`, style: { width: '100px', height: '100px', display: 'block', marginBottom: '10px' } })
                            : m("p", { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '10px' } }, vnode.state.fileName),
                        m("button.uk-button.uk-button-danger.uk-button-small", {
                            style: { width: '100px' }, // Hacer el botón de un ancho fijo
                            onclick: () => {
                                onRemove();
                                vnode.state.isUploading = false; // Resetear el estado de carga
                                vnode.state.fileName = ""; // Resetear el nombre del archivo
                                vnode.state.isImage = false; // Resetear el estado de imagen
                            }
                        }, "Eliminar")
                    ])
                    : m("span.uk-text-muted", "No hay archivo")
                : [
                    !value && m("div.uk-form-custom", [
                        m("input[type=file]", {
                            onchange: e => {
                                const file = e.target.files[0];
                                if (file) {
                                    vnode.state.isUploading = true; // Cambiar estado a "subiendo"
                                    vnode.state.fileName = file.name; // Guardar el nombre del archivo
                                    m.redraw();

                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        const result = reader.result.split(',')[1];
                                        onInput(result);
                                        vnode.state.isUploading = false; // Restablecer estado después de la carga
                                        vnode.state.isImage = file.type.startsWith('image/'); // Verificar si es una imagen
                                        m.redraw();
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }
                        }),
                        m("button.uk-button.uk-button-default", {
                            disabled: vnode.state.isUploading, // Deshabilitar mientras se sube
                            style: { backgroundColor: vnode.state.isUploading ? '#ccc' : '', color: vnode.state.isUploading ? '#777' : '' },
                        }, vnode.state.isUploading ? "Subiendo archivo..." : "Seleccionar archivo")
                    ]),

                    value && !vnode.state.isUploading ? m("div", [
                        vnode.state.isImage
                            ? m("img", { src: `data:image/*;base64,${value}`, style: { width: '100px', height: '100px', display: 'block', marginBottom: '10px' } })
                            : m("p", { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '10px' } }, vnode.state.fileName),
                        m("button.uk-button.uk-button-danger.uk-button-small", {
                            style: { width: '100px', display: 'block', marginTop: '10px' }, // Botón debajo de la imagen o el texto
                            onclick: () => {
                                onRemove();
                                vnode.state.isUploading = false; // Resetear el estado de carga
                                vnode.state.fileName = ""; // Resetear el nombre del archivo
                                vnode.state.isImage = false; // Resetear el estado de imagen
                            }
                        }, "Eliminar")
                    ]) : null
                ],

            error ? m("div.uk-text-danger", error) : null
        ]);
    }
};

export default File;
