/**
 * Fila - Componente para manejar una grilla de columnas utilizando UIkit.
 *
 * Props:
 * @param {string} gap - El tamaño del espacio entre las columnas (small, medium, large, collapse).
 */
const Fila = {
    view: vnode => {
        const { gap = 'medium' } = vnode.attrs;
        return m("div", { class: `uk-grid uk-grid-${gap}`, 'uk-grid': true }, vnode.children);
    }
};

export default Fila;
