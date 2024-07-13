import FirebaseModel from '../models/FirebaseModel.js';

const ProveedoresArticuloView = {
    oninit: (vnode) => {
        vnode.state.proveedores = [];
        vnode.state.todosProveedores = [];
        vnode.state.selectedProveedor = null;

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
        const { proveedores, todosProveedores, selectedProveedor } = vnode.state;

        return m('div', [
            m('h1', 'Proveedores por Artículo'),
            m('hr'),

            // Lista de proveedores actuales del artículo
            m('ul', proveedores.map(proveedorId => {
                const proveedor = todosProveedores.find(p => p.id === proveedorId);
                return m('li', [
                    proveedor ? proveedor.nombre : '',
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

            // Select para agregar nuevos proveedores
            m('label', 'Proveedor: '),
            m('select', {
                onchange: (e) => vnode.state.selectedProveedor = e.target.value
            }, [
                m('option', { value: '' }, 'Seleccionar Proveedor'),
                ...todosProveedores.map(proveedor => 
                    m('option', { value: proveedor.id }, proveedor.nombre)
                )
            ]),
            m('span', ' '),
            m('button', {
                onclick: () => {
                    if (selectedProveedor && !proveedores.includes(selectedProveedor)) {
                        const articuloId = vnode.attrs.articuloId;
                        FirebaseModel.getById('articulos', articuloId).then(articulo => {
                            articulo.proveedores = articulo.proveedores || [];
                            articulo.proveedores.push(selectedProveedor);
                            FirebaseModel.saveOrUpdate('articulos', articuloId, articulo).then(() => {
                                vnode.state.proveedores.push(selectedProveedor);
                                vnode.state.selectedProveedor = null;
                                m.redraw();
                            });
                        });
                    } else {
                        alert('Este proveedor ya está agregado al artículo.');
                    }
                }
            }, 'Agregar'),

            m('hr'),

            m('a', { href: 'javascript:void(0)', onclick: () => window.history.back() }, 'Regresar'),
            m('span', ' | '),
            m('a', { href: m.route.prefix + '/', oncreate: m.route.Link }, 'Regresar al Inicio')
        ]);
    }
};

export default ProveedoresArticuloView;
