/**
 * ModalFullPage - Componente para mostrar un modal a pantalla completa.
 *
 * Este componente renderiza un modal que ocupa toda la pantalla del navegador.
 * Es útil para mostrar contenido en una vista inmersiva, como un carrusel
 * o cualquier otro tipo de contenido que requiera la atención completa del usuario.
 *
 * Props:
 * @param {boolean} show - Indica si el modal debe estar visible. 
 *                         Si es `true`, el modal se muestra; si es `false`, no se renderiza.
 * @param {Function} onClose - Función que se llama cuando se cierra el modal.
 *                             Se recomienda usar esta función para modificar el estado `show` en el componente padre.
 * @param {m.Children} content - Contenido principal del modal.
 *                               Este contenido se renderiza dentro del modal en pantalla completa.
 * @param {boolean} showCloseButton - Indica si se debe mostrar un botón para cerrar el modal.
 */
const ModalFullPage = {
    view: vnode => {
        const { show, onClose, content, showCloseButton } = vnode.attrs;

        // Si `show` es `false`, no se renderiza el modal.
        if (!show) return null;

        return m("div", {
            style: {
                position: "fixed",          // El modal se posiciona de manera fija en la pantalla.
                top: 0,                     // Se alinea en la parte superior.
                left: 0,                    // Se alinea a la izquierda.
                width: "100%",              // Ocupa el 100% del ancho de la pantalla.
                height: "100%",             // Ocupa el 100% de la altura de la pantalla.
                backgroundColor: "rgba(0, 0, 0, 0.8)",  // Fondo oscuro semitransparente.
                zIndex: 1000,               // Se asegura de que el modal esté por encima de otros elementos.
                display: "flex",            // Uso de Flexbox para centrar el contenido.
                justifyContent: "center",   // Centra el contenido horizontalmente.
                alignItems: "center"        // Centra el contenido verticalmente.
            }
        }, [
            m("div", {
                style: {
                    position: "relative",  // El contenedor del contenido está posicionado relativamente.
                    width: "100%",         // El contenedor ocupa todo el ancho del modal.
                    height: "100%",        // El contenedor ocupa toda la altura del modal.
                    backgroundColor: "#fff", // Fondo blanco para el contenido.
                    overflow: "hidden"     // Oculta cualquier contenido que se salga del área visible.
                }
            }, [
                showCloseButton && m("button", {
                    type: "button",
                    style: {
                        position: "absolute",  // El botón está posicionado de manera absoluta.
                        top: "10px",           // Se posiciona a 10px del borde superior.
                        right: "10px",         // Se posiciona a 10px del borde derecho.
                        zIndex: 1001           // Se asegura de que el botón esté por encima del contenido.
                    },
                    onclick: onClose          // Llama a la función `onClose` cuando se hace clic.
                }, "✕"),
                
                // Contenido principal del modal.
                m("div", { style: { height: "100%", width: "100%" } }, content)
            ])
        ]);
    }
};

export default ModalFullPage;
