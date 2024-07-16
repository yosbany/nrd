import FirebaseModel from '../models/FirebaseModel.js';
import Table from '../components/base/Table.js';

const ProveedoresArticuloView = {
    oninit: (vnode) => {
        vnode.state.proveedores = [];
        vnode.state.todosProveedores = [];
        vnode.state.selectedProveedor = null;
        vnode.state.codigoArticuloProveedor = '';
        vnode.state.precioUnitarioProveedor = 0;
        vnode.state.editingProveedorId = null;

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
        const { proveedores, todosProveedores, selectedProveedor, codigoArticuloProveedor, precioUnitarioProveedor, editingProveedorId } = vnode.state;

        const rows = proveedores.map(({ proveedorId, codigoArticulo, precioUnitario }) => {
            const proveedor = todosProveedores.find(p => p.id === proveedorId);
            return [
                m('td', proveedor ? proveedor.nombre : 'Proveedor no encontrado'),
                m('td', codigoArticulo),
                m('td', precioUnitario),
                m('td', [
                    m('a', {
                        href: 'javascript:void(0)',
                        onclick: () => {
                            // Editar proveedor
                            vnode.state.selectedProveedor = proveedorId;
                            vnode.state.codigoArticuloProveedor = codigoArticulo;
                            vnode.state.precioUnitarioProveedor = precioUnitario ? precioUnitario : 0;
                            vnode.state.editingProveedorId = proveedorId;
                        }
                    }, 'Editar'),
                    m('span', ' | '),
                    m('a', {
                        href: 'javascript:void(0)',
                        onclick: () => {
                            if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
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
                ])
            ];
        });

        return m('div', [
            m('h1', 'Proveedores por Artículo'),
            m('hr'),

            // Usando el componente Table
            m(Table, {
                headers: ['Proveedor', 'Código Artículo', 'Precio Unitario', 'Acciones'],
                rows: rows
            }),

            m('hr'),

            // Formulario para agregar/editar proveedores
            m('div', { style: { marginBottom: '10px' } }, [
                m('label', { style: { display: 'inline-block', width: '150px' } }, 'Proveedor:'),
                m('select', {
                    style: { width: '200px' },
                    value: selectedProveedor || '',
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
                m('input[type=number]', {
                    value: precioUnitarioProveedor,
                    style: { width: '200px' },
                    onchange: (e) => vnode.state.precioUnitarioProveedor = parseFloat(e.target.value) || 0
                })
            ]),
            m('div', { style: { marginTop: '20px' } }, [
                m('button', {
                    onclick: () => {
                        const articuloId = vnode.attrs.articuloId;

                        FirebaseModel.getById('articulos', articuloId).then(articulo => {
                            articulo.proveedores = articulo.proveedores || [];

                           const proveedor = {
                                proveedorId: selectedProveedor,
                                codigoArticulo: codigoArticuloProveedor,
                                precioUnitario: precioUnitarioProveedor
                            };

                            if (editingProveedorId) {
                                // Actualizar proveedor existente
                                articulo.proveedores = articulo.proveedores.map(p => 
                                    p.proveedorId === editingProveedorId ? proveedor : p
                                );
                            } else {
                                // Agregar nuevo proveedor
                                if (!proveedores.some(p => p.proveedorId === selectedProveedor)) {
                                    articulo.proveedores.push(proveedor);
                                } else {
                                    alert('Este proveedor ya está agregado al artículo.');
                                    return;
                                }
                            }

                            FirebaseModel.saveOrUpdate('articulos', articuloId, articulo).then(() => {
                                vnode.state.proveedores = articulo.proveedores;
                                vnode.state.selectedProveedor = null;
                                vnode.state.codigoArticuloProveedor = '';
                                vnode.state.precioUnitarioProveedor = 0;
                                vnode.state.editingProveedorId = null;
                                m.redraw();
                            });
                        });
                    }
                }, editingProveedorId ? 'Actualizar' : 'Agregar')
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
