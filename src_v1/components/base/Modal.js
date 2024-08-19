/**
 * Modal - Componente para mostrar un modal.
 *
 * Props:
 * @param {boolean} show - Indica si el modal debe estar visible.
 * @param {Function} onClose - Función que se llama cuando se cierra el modal.
 * @param {string} title - El título del modal.
 * @param {string} content - Contenido principal del modal.
 */
const Modal = {
    view: vnode => {
        const { show, onClose, title, content } = vnode.attrs;

        if (!show) return null;

        return m("div.uk-modal.uk-open", { style: { display: "block" } }, [
            m("div.uk-modal-dialog.uk-modal-body", [
                m("button.uk-modal-close-default", { type: "button", onclick: onClose, "uk-close": true }),
                m("h2.uk-modal-title", title),
                m("div.uk-modal-content", content),
                vnode.children.length > 0 && m("div.uk-flex.uk-flex-right.uk-margin-top", vnode.children)
            ])
        ]);
    }
};

export default Modal;
