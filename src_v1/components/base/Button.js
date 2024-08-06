/**
 * Button - Componente base para botones utilizando estilos UIkit.
 *
 * Props:
 * @param {string} type - El tipo de botón (default, primary, secondary, danger, text, link).
 * @param {string} label - La etiqueta del botón.
 * @param {string} documentation - Descripción del botón, usada como tooltip.
 * @param {boolean} disabled - Indica si el botón está deshabilitado.
 * @param {Function} onClick - Función que se llama al hacer clic en el botón.
 */
const Button = {
    view: vnode => {
        const { type = 'default', label, documentation, disabled = false, onClick } = vnode.attrs;

        // Definir la clase de UIkit según el tipo de botón
        const buttonClass = `uk-button uk-button-${type}`;

        return m("div", { "uk-margin": true }, [
            m("button", {
                class: buttonClass,
                title: documentation || "",
                disabled,
                onclick: e => {
                    if (!disabled && onClick) {
                        onClick(e);
                    }
                }
            }, label)
        ]);
    }
};

export default Button;
