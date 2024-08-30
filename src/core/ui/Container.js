/**
 * Container - Componente para manejar un contenedor utilizando UIkit.
 *
 * Props:
 * @param {string} size - El tamaño del contenedor (small, large, expand).
 * @param {boolean} center - Centra el contenido dentro del contenedor.
 */
const Container = {
    view: vnode => {
        const { size = '', center = false } = vnode.attrs;
        let classList = `uk-container${size ? ` uk-container-${size}` : ''}`;
        if (center) classList += ' uk-container-center';

        return m("div", { class: classList }, vnode.children);
    }
};

export default Container;
