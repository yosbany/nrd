import FirebaseModel from '../models/FirebaseModel.js';
import Table from '../components/base/Table.js';
import Link from '../components/base/Link.js';
import VerticalLayout from '../components/base/VerticalLayout.js';
import OutputText from '../components/base/OutputText.js';
import HorizontalLayout from '../components/base/HorizontalLayout.js';
import SearchInput from '../components/base/SearchInput.js';

const UsuarioListView = {
    oninit: (vnode) => {
        vnode.state.filteredItems = [];
        FirebaseModel.getAll('usuarios').then(items => {
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
            m('h2', 'Lista de Usuarios'),
            m('div', { class: 'search-bar' }, [
                m(SearchInput, {
                    placeholder: 'Buscar usuarios...',
                    oninput: filterItems
                }),
                m(Link, { href: '/usuarios/nuevo', text: 'Agregar Usuario' })
            ]),
            m(Table, {
                headers: ['Nombre', 'Acciones'],
                rows: filteredItems.map(item => [
                    m(OutputText, { text: item.nombre }),
                    m(HorizontalLayout, [
                        m(Link, { href: `/usuarios/editar/${item.id}`, text: 'Editar' }),
                        m('span', ' | '),
                        m(Link, {
                            href: 'javascript:void(0)',
                            text: 'Eliminar',
                            onclick: () => {
                                if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                                    FirebaseModel.delete('usuarios', item.id).then(() => {
                                        vnode.state.filteredItems = vnode.state.filteredItems.filter(i => i.id !== item.id);
                                        m.redraw();
                                    });
                                }
                            }
                        })
                    ])
                ])
            })
        ]);
    }
};

export default UsuarioListView;
