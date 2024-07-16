import FirebaseModel from '../models/FirebaseModel.js';
import Table from '../components/base/Table.js';
import Link from '../components/base/Link.js';
import VerticalLayout from '../components/base/VerticalLayout.js';
import OutputText from '../components/base/OutputText.js';
import HorizontalLayout from '../components/base/HorizontalLayout.js';
import InputText from '../components/base/InputText.js';

const ProveedorListView = {
    oninit: (vnode) => {
        vnode.state.items = [];
        vnode.state.searchTerm = '';

        FirebaseModel.getAll('proveedores').then(items => {
            vnode.state.items = items || [];
            m.redraw();
        });
    },
    view: (vnode) => {
        const items = vnode.state.items.filter(item =>
            item.nombre.toLowerCase().includes(vnode.state.searchTerm.toLowerCase())
        );

        return m(VerticalLayout, [
            m('h2', 'Lista de Proveedores'),
            m(InputText, {
                label: 'Buscar',
                value: vnode.state.searchTerm,
                oninput: (e) => vnode.state.searchTerm = e.target.value
            }),
            m(Table, {
                headers: ['Código', 'Nombre', 'Acciones'],
                rows: items.map(item => [
                    m(OutputText, { text: item.codigo }),
                    m(OutputText, { text: item.nombre }),
                    m(HorizontalLayout, [
                        m(Link, { href: `/proveedores/editar/${item.id}`, text: 'Editar' }),
                        m('span', ' | '),
                        m(Link, {
                            href: 'javascript:void(0)',
                            text: 'Eliminar',
                            onclick: () => {
                                if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
                                    FirebaseModel.delete('proveedores', item.id).then(() => {
                                        vnode.state.items = vnode.state.items.filter(i => i.id !== item.id);
                                        m.redraw();
                                    });
                                }
                            }
                        })
                    ])
                ])
            }),
            m(Link, { href: '/proveedores/nuevo', text: 'Agregar Proveedor' })
        ]);
    }
};

export default ProveedorListView;
