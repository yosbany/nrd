/**
 * Column - Componente para manejar una columna utilizando UIkit.
 *
 * Props:
 * @param {string} width - El ancho de la columna (e.g., '1-2', '1-3', 'expand', etc.).
 */
const Column = {
    view: vnode => {
        const { width } = vnode.attrs;
        return m("div", { class: `uk-width-${width}` }, vnode.children);
    }
};

export default Column;
