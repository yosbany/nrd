/**
 * Link - Componente para manejar asociaciones a otras entidades o enlaces directos.
 *
 * Props:
 * @param {string} path - Ruta base para construir el enlace completo (opcional).
 * @param {string} label - La etiqueta del campo de entrada.
 * @param {string} textLink - El texto que se mostrará como el enlace.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo de entrada.
 * @param {Function} onClick - Función a ejecutar en lugar de navegar, si se proporciona.
 */
const Link = {
    view: vnode => {
        const { path, label, textLink, id,  documentation, showLabel, onClick, ...attrs } = vnode.attrs;

        return m("div.uk-margin-small", [
            showLabel !== false && m("label.uk-form-label", {
                title: documentation || ""
            }, `${label}:`),
            m("a", {
                href: path || "#",  // Siempre asigna un href, pero predetermina a "#" si no hay ruta
                onclick: e => {
                    if (onClick) {
                        e.preventDefault(); // Prevenir la navegación si hay una función onClick
                        onClick(id);         // Ejecutar la función onClick
                    } else if (path) {
                        e.preventDefault(); // Prevenir la navegación por defecto
                        m.route.set(path);  // Navegar a la ruta especificada
                    }
                },
                style: { 
                    color: 'blue', // Mantener el color azul para la interacción
                    cursor: 'pointer' 
                },
                ...attrs // Pasar todos los demás atributos al elemento <a>
            }, textLink || "Ir") // Usar textLink como el texto del enlace, con "Ir" como valor predeterminado
        ]);
    }
};

export default Link;
