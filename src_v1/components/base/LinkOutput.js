/**
 * LinkOutput - Componente para manejar asociaciones a otras entidades o enlaces directos.
 *
 * Props:
 * @param {string} path - Ruta base para construir el enlace completo.
 * @param {string} label - La etiqueta del campo de entrada.
 * @param {string} documentation - Descripción del campo, usada como tooltip.
 * @param {boolean} showLabel - Indica si se debe mostrar la etiqueta del campo de entrada.
 */
const LinkOutput = {
    view: vnode => {
        const { path, label, documentation, showLabel } = vnode.attrs;

        const linkHref = path || "";

        return m("div.uk-margin-small", [
            showLabel !== false && m("label.uk-form-label", {
                title: documentation || ""
            }, `${label}:`),
            m("a", {
                href: linkHref,
                onclick: e => {
                    if (!linkHref) {
                        e.preventDefault(); 
                    } else {
                        m.route.set(linkHref);
                    }
                },
                style: { 
                    pointerEvents: linkHref ? 'auto' : 'none', 
                    color: linkHref ? 'blue' : 'grey',
                    cursor: linkHref ? 'pointer' : 'default' 
                }
            }, linkHref ? `Ir a ${label}` : "No disponible")
        ]);
    }
};

export default LinkOutput;
