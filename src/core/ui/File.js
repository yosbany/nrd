const File = {
    oninit: vnode => {
        vnode.state.isUploading = false; // Estado para controlar la carga del archivo
        vnode.state.files = []; // Estado para almacenar los archivos cargados
    },

    view: vnode => {
        const { onInput, onRemove, outputMode, clearFiles } = vnode.attrs;

        // Si clearFiles está activo, limpiar los archivos cargados
        if (clearFiles && vnode.state.files.length > 0) {
            vnode.state.files = [];
        }

        return m("div.uk-margin-small", [
            !outputMode && m("div.uk-form-custom", [
                m("input[type=file]", {
                    multiple: true, // Permitir múltiples archivos
                    onchange: e => {
                        const files = Array.from(e.target.files);
                        if (files.length) {
                            vnode.state.isUploading = true; // Cambiar estado a "subiendo"
                            vnode.state.files = files; // Guardar los archivos directamente

                            // Pasar los archivos directamente al onInput
                            files.forEach(file => onInput(file));

                            vnode.state.isUploading = false; // Restablecer estado después de la carga
                            m.redraw();
                        }
                    }
                }),
                m("button.uk-button.uk-button-default", {
                    disabled: vnode.state.isUploading, // Deshabilitar mientras se sube
                    style: { backgroundColor: vnode.state.isUploading ? '#ccc' : '', color: vnode.state.isUploading ? '#777' : '' },
                }, vnode.state.isUploading ? "Subiendo archivo..." : "Seleccionar archivo")
            ]),

            vnode.state.files.length > 0 && m("ul.uk-list.uk-list-bullet", vnode.state.files.map(file =>
                m("li", { key: file.name }, [
                    m("span", file.name),
                    m("span.uk-text-danger.uk-margin-small-left", {
                        style: { cursor: 'pointer' }, // Estilo de cursor de puntero para indicar que es clicable
                        onclick: () => {
                            vnode.state.files = vnode.state.files.filter(f => f !== file);
                            onRemove(file);
                            m.redraw();
                        }
                    }, "✖")
                ])
            ))
        ]);
    }
};

export default File;
