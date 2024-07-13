import FirebaseModel from '../models/FirebaseModel.js';

const ProveedoresArticuloView = {
    oninit: (vnode) => {
        vnode.state.proveedores = [];
        vnode.state.todosProveedores = [];
        vnode.state.selectedProveedor = null;
        vnode.state.codigoArticuloProveedor = '';

        const { articuloId } = vnode.attrs;

        // Obtener proveedores actuales del artículo
        FirebaseModel.getById('articulos', articuloId).then(articulo => {
            vnode.state.proveedores = articulo.proveedores || [];
            m.redraw();
        });

        // Obtener todos los proveedores disponibles
        FirebaseModel.getAll('proveedores').then(todosProveedores => {
            vnode.state.todosProveedores = todosProveedores || [];
            m.redraw();
        });
    },
    view: (vnode) => {
        const { proveedores, todosProveedores, selectedProveedor, codigoArticuloProveedor } = vnode.state;

        return m('div', [
            m('h1', 'Proveedores por Artículo'),
            m('hr'),

            // Lista de proveedores actuales del artículo
            m('ul', proveedores.map(({ proveedorId, codigoArticulo }) => {
                console.log(codigoArticulo,proveedorId )
                const proveedor = todosProveedores.find(p => p.id === proveedorId);
                return m('li', [
                    proveedor ? `(${codigoArticulo}) ${proveedor.nombre}` : '',
                    m('span', ' '),
                    m('a', {
                        href: 'javascript:void(0)',
                        onclick: () => {
                            // Eliminar proveedor del artículo
                            const articuloId = vnode.attrs.articuloId;
                            FirebaseModel.getById('articulos', articuloId).then(articulo => {
                                articulo.proveedores = articulo.proveedores.filter(id => id !== proveedorId);
                                FirebaseModel.saveOrUpdate('articulos', articuloId, articulo).then(() => {
                                    vnode.state.proveedores = vnode.state.proveedores.filter(id => id !== proveedorId);
                                    m.redraw();
                                });
                            });
                        }
                    }, 'Eliminar')
                ]);
            })),

            m('hr'),

            // Formulario para agregar proveedor al artículo
            m('div', { style: { marginBottom: '10px' } }, [
                m('label', { style: { display: 'inline-block', width: '150px' } }, 'Proveedor:'),
                m('select', {
                    style: { width: '200px' },
                    onchange: (e) => vnode.state.selectedProveedor = e.target.value
                }, [
                    m('option', { value: '' }, 'Seleccionar Proveedor'),
                    ...todosProveedores.map(proveedor =>
                        m('option', { value: proveedor.id }, proveedor.nombre)
                    )
                ]),
            ]),
            m('div', { style: { marginBottom: '10px' } }, [
                m('label', { style: { display: 'inline-block', width: '150px' } }, 'Código Artículo:'),
                m('input[type=text]', {
                    value: codigoArticuloProveedor,
                    style: { width: '200px' },
                    onchange: (e) => vnode.state.codigoArticuloProveedor = e.target.value
                })
            ]),
            m('div', { style: { marginTop: '20px' } }, [
                m('button', {
                    onclick: () => {
                        if (selectedProveedor && !proveedores.includes(selectedProveedor)) {
                            const articuloId = vnode.attrs.articuloId;
                            const proveedor = {
                                proveedorId: selectedProveedor,
                                codigoArticulo: codigoArticuloProveedor
                            };

                            FirebaseModel.getById('articulos', articuloId).then(articulo => {
                                articulo.proveedores = articulo.proveedores || [];
                                articulo.proveedores.push(proveedor);
                                FirebaseModel.saveOrUpdate('articulos', articuloId, articulo).then(() => {
                                    vnode.state.proveedores.push(selectedProveedor);
                                    vnode.state.selectedProveedor = null;
                                    vnode.state.codigoArticuloProveedor = '';
                                    m.redraw();
                                });
                            });
                        } else {
                            alert('Este proveedor ya está agregado al artículo.');
                        }
                    }
                }, 'Agregar')
            ]),

            m('hr'),

            // Enlaces para regresar
            m('a', { href: 'javascript:void(0)', onclick: () => window.history.back() }, 'Regresar'),
            m('span', ' | '),
            m('a', { href: m.route.prefix + '/', oncreate: m.route.Link }, 'Regresar al Inicio')
        ]);
    }
};

export default ProveedoresArticuloView;
