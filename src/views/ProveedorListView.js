import OutputText from '../components/base/OutputText.js';
import Link from '../components/base/Link.js';
import FirebaseModel from '../models/FirebaseModel.js';
import VerticalLayout from '../components/base/VerticalLayout.js';
import Table from '../components/base/Table.js';
import HorizontalLayout from '../components/base/HorizontalLayout.js';
import SearchInput from '../components/base/SearchInput.js';

const ProveedorListView = {
    oninit: (vnode) => {
        vnode.state.filteredItems = [];
        FirebaseModel.getAll('proveedores').then(items => {
            vnode.state.filteredItems = items || [];
            m.redraw();
        });
    },
    view: (vnode) => {
        const { filteredItems } = vnode.state;

        const filterItems = (e) => {
            const query = e.target.value.toLowerCase();
            vnode.state.filteredItems = vnode.state.items.filter(item =>
                item.nombre.toLowerCase().includes(query)
            );
        };

        return m(VerticalLayout, [
            m('h2', 'Lista de Proveedores'),
            m('div', { class: 'search-bar' }, [
                m(SearchInput, {
                    placeholder: 'Buscar proveedores...',
                    oninput: filterItems
                }),
                m(Link, { href: '/proveedores/nuevo', text: 'Agregar Proveedor' })
            ]),
            m(Table, {
                headers: ['Código', 'Nombre', 'Acciones'],
                rows: filteredItems.map(item => [
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
                                        vnode.state.filteredItems = vnode.state.filteredItems.filter(i => i.id !== item.id);
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
