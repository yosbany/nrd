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
        vnode.state.precioUnitarioProveedor = '';
        vnode.state.editingIndex = null;

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
        const { proveedores, todosProveedores, selectedProveedor, codigoArticuloProveedor, precioUnitarioProveedor, editingIndex } = vnode.state;

        return m('div', [
            m('h1', 'Proveedores por Artículo'),
            m('hr'),
            m('ul', proveedores.map(({ proveedorId, codigoArticulo, precioUnitario }, index) => {
                const proveedor = todosProveedores.find(p => p.id === proveedorId);
                return m('li', [
                    proveedor ? `(${codigoArticulo}) ${proveedor.nombre} - $${precioUnitario}` : 'Proveedor no encontrado',
                    m('span', ' '),
                    m('a', {
                        href: 'javascript:void(0)',
                        onclick: () => {
                            const articuloId = vnode.attrs.articuloId;
                            FirebaseModel.getById('articulos', articuloId).then(articulo => {
                                articulo.proveedores = articulo.proveedores.filter(p => p.proveedorId !== proveedorId);
                                FirebaseModel.saveOrUpdate('articulos', articuloId, articulo).then(() => {
                                    vnode.state.proveedores = vnode.state.proveedores.filter(p => p.proveedorId !== proveedorId);
                                    m.redraw();
                                });
                            });
                        }
                    }, 'Eliminar'),
                    m('span', ' | '),
                    m('a', {
                        href: 'javascript:void(0)',
                        onclick: () => {
                            vnode.state.selectedProveedor = proveedorId;
                            vnode.state.codigoArticuloProveedor = codigoArticulo;
                            vnode.state.precioUnitarioProveedor = precioUnitario;
                            vnode.state.editingIndex = index;
                            m.redraw();
                        }
                    }, 'Editar')
                ]);
            })),

            m('hr'),

            m('div', { style: { marginBottom: '10px' } }, [
                m('label', { style: { display: 'inline-block', width: '150px' } }, 'Proveedor:'),
                m('select', {
                    style: { width: '200px' },
                    value: selectedProveedor,
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
            m('div', { style: { marginBottom: '10px' } }, [
                m('label', { style: { display: 'inline-block', width: '150px' } }, 'Precio Unitario:'),
                m('input[type=text]', {
                    value: precioUnitarioProveedor,
                    style: { width: '200px' },
                    onchange: (e) => vnode.state.precioUnitarioProveedor = e.target.value
                })
            ]),
            m('div', { style: { marginTop: '20px' } }, [
                m('button', {
                    onclick: () => {
                        if (selectedProveedor) {
                            const articuloId = vnode.attrs.articuloId;
                            
                            FirebaseModel.getById('articulos', articuloId).then(articulo => {
                                articulo.proveedores = articulo.proveedores || [];
                                const proveedor = {
                                    proveedorId: selectedProveedor,
                                    codigoArticulo: codigoArticuloProveedor || limpiarNombre(todosProveedores.find(p => p.id === selectedProveedor).nombre),
                                    precioUnitario: precioUnitarioProveedor
                                };
                                
                                if (editingIndex !== null) {
                                    // Actualizar proveedor existente
                                    articulo.proveedores[editingIndex] = proveedor;
                                    vnode.state.proveedores[editingIndex] = proveedor;
                                } else {
                                    // Agregar nuevo proveedor
                                    articulo.proveedores.push(proveedor);
                                    vnode.state.proveedores.push(proveedor);
                                }

                                FirebaseModel.saveOrUpdate('articulos', articuloId, articulo).then(() => {
                                    vnode.state.selectedProveedor = null;
                                    vnode.state.codigoArticuloProveedor = '';
                                    vnode.state.precioUnitarioProveedor = '';
                                    vnode.state.editingIndex = null;
                                    m.redraw();
                                });
                            });
                        } else {
                            alert('Por favor, seleccione un proveedor.');
                        }
                    }
                }, editingIndex !== null ? 'Actualizar' : 'Agregar')
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
