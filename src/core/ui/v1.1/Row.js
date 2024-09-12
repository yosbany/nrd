const Row = {
    view: (vnode) => {
        const { align = 'left', gap = 10, tight = false, margin = true, ...attrs } = vnode.attrs;

        // Definir la clase de alineación
        let alignClass = '';
        let totalDefinedWidth = 0;
        let childrenWithoutWidth = 0;

        // Calcular el ancho definido de los hijos y cuántos no tienen width
        switch (align) {
            case 'right':
                alignClass = 'uk-flex-right';
                break;
            case 'center':
                alignClass = 'uk-flex-center';
                break;
            case 'justify':
                alignClass = 'uk-flex-between';
                vnode.children.forEach(child => {
                    if (child.attrs?.width) {
                        totalDefinedWidth += parseFloat(child.attrs.width);
                    } else {
                        childrenWithoutWidth++;
                    }
                });
                break;
            default:
                alignClass = 'uk-flex-left'; // Default alignment
        }

        // Convertir gap a píxeles si es un número
        const gapValue = typeof gap === 'number' ? `${gap}px` : gap;

        // Calcular el ancho restante para los hijos que no tienen width en modo justify
        const remainingWidth = align === 'justify' && childrenWithoutWidth > 0
            ? `${(100 - totalDefinedWidth) / childrenWithoutWidth}%`
            : 'auto';

        return m('div', {
            class: `uk-flex ${alignClass} ${!tight && margin ? 'uk-margin' : ''}`,  // Aplicar margen externo solo si `tight` es falso
            style: { gap: gapValue },  // Aplicar el gap entre los hijos
            component: 'Row',
            ...attrs
        }, vnode.children.map((child, index) => {
            // Si la alineación es justify y el hijo no tiene width, se le asigna el remainingWidth
            const width = child.attrs?.width || (align === 'justify' ? remainingWidth : 'auto');

            return m('div', {
                style: {
                    width,  // Aplicar el width general o el remainingWidth
                    marginRight: index !== vnode.children.length - 1 ? gapValue : '0',
                    maxWidth: '100%'
                }
            }, child);
        }));
    }
};

export default Row;
