import FirebaseModel from '../models/FirebaseModel.js';

const ProveedoresArticuloView = {
    oninit: (vnode) => {
        vnode.state.proveedores = [];
        vnode.state.todosProveedores = [];
        vnode.state.selectedProveedor = null;
        vnode.state.codigoArticuloProveedor = '';
        vnode.state.precioUnitarioProveedor = '';

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
        const { proveedores, todosProveedores, selectedProveedor, codigoArticuloProveedor, precioUnitarioProveedor } = vnode.state;

        return m('div', [
            m('h1', 'Proveedores por Artículo'),
            m('hr'),
            m('ul', proveedores.map(({ proveedorId, codigoArticulo }) => {
                const proveedor = todosProveedores.find(p => p.id === proveedorId);
                return m('li', [
                    proveedor ? `(${codigoArticulo}) ${proveedor.nombre}` : 'Proveedor no encontrado',
                    m('span', ' '),
                    m('a', {
                        href: 'javascript:void(0)',
                        onclick: () => {
                            if (confirm('¿Está seguro que desea eliminar este proveedor?')) {
                                const articuloId = vnode.attrs.articuloId;
                                FirebaseModel.getById('articulos', articuloId).then(articulo => {
                                    articulo.proveedores = articulo.proveedores.filter(p => p.proveedorId !== proveedorId);
                                    FirebaseModel.saveOrUpdate('articulos', articuloId, articulo).then(() => {
                                        vnode.state.proveedores = vnode.state.proveedores.filter(p => p.proveedorId !== proveedorId);
                                        m.redraw();
                                    });
                                });
                            }
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
                        if (selectedProveedor && !proveedores.some(p => p.proveedorId === selectedProveedor)) {
                            const proveedor = {
                                proveedorId: selectedProveedor,
                                codigoArticulo: codigoArticuloProveedor || '',
                                precioUnitario: parseFloat(precioUnitarioProveedor) || 0
                            };

                            const articuloId = vnode.attrs.articuloId;
                            FirebaseModel.getById('articulos', articuloId).then(articulo => {
                                articulo.proveedores = [...(articulo.proveedores || []), proveedor];
                                FirebaseModel.saveOrUpdate('articulos', articuloId, articulo).then(() => {
                                    vnode.state.proveedores.push(proveedor);
                                    vnode.state.selectedProveedor = null;
                                    vnode.state.codigoArticuloProveedor = '';
                                    vnode.state.precioUnitarioProveedor = '';
                                    m.redraw();
                                });
                            });
                        }
                    }
                }, 'Agregar Proveedor')
            ])
        ]);
    }
};

export default ProveedoresArticuloView;
