import FirebaseModel from '../models/FirebaseModel.js';

// Función para limpiar el nombre
const limpiarNombre = (nombre) => {
    return nombre
        .toUpperCase()
        .replace(/[^A-Z\s]/g, '');
};


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
            m('ul', proveedores.map(({ proveedorId, codigoArticulo }) => {
                console.log(codigoArticulo,proveedorId )
                const proveedor = todosProveedores.find(p => p.id === proveedorId);
                return m('li', [
                    proveedor ? `(${codigoArticulo}) ${proveedor.nombre}` : 'Proveedor no encontrado',
                    m('span', ' '),
                    m('a', {
                        href: 'javascript:void(0)',
                        onclick: () => {
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
                            
                            FirebaseModel.getById('articulos', articuloId).then(articulo => {
                                articulo.proveedores = articulo.proveedores || [];
                                const codigo = codigoArticuloProveedor ? codigoArticuloProveedor : limpiarNombre(articulo.nombre);
                                const proveedor = {
                                    proveedorId: selectedProveedor,
                                    codigoArticulo: codigo
                                };
                                articulo.proveedores.push(proveedor);
                                FirebaseModel.saveOrUpdate('articulos', articuloId, articulo).then(() => {
                                    vnode.state.proveedores.push(proveedor);
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
