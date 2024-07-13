
const ProveedoresArticuloView = {
    view: () => {
        return m('div', [
            m('h1', 'Proveedores por Artículo'),
            m('hr'),
            m('a', { href: m.route.prefix + '/', oncreate: m.route.Link }, 'Regresar al Inicio')
        ]);
    }
};

export default ProveedoresArticuloView;
