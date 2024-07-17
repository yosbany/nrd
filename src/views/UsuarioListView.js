import FirebaseModel from '../models/FirebaseModel.js';
import Table from '../components/base/Table.js';
import Link from '../components/base/Link.js';
import VerticalLayout from '../components/base/VerticalLayout.js';
import OutputText from '../components/base/OutputText.js';
import HorizontalLayout from '../components/base/HorizontalLayout.js';
import InputText from '../components/base/InputText.js';

const UsuarioListView = {
    oninit: (vnode) => {
        vnode.state.items = [];
        vnode.state.searchTerm = '';

        FirebaseModel.getAll('usuarios').then(items => {
            vnode.state.items = items || [];
            m.redraw();
        });
    },
    view: (vnode) => {
        const { items, searchTerm } = vnode.state;
        const filteredItems = items.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const rows = filteredItems.map(item => [
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
                                vnode.state.items = vnode.state.items.filter(i => i.id !== item.id);
                                m.redraw();
                            });
                        }
                    }
                })
            ])
        ]);

        return m(VerticalLayout, [
            m(InputText, {
                value: searchTerm,
                oninput: (e) => {
                    vnode.state.searchTerm = e.target.value;
                    m.redraw();
                },
                placeholder: 'Buscar usuario...'
            }),
            m(Table, {
                headers: ['Nombre', 'Acciones'],
                body: rows,
                label: 'Lista de Usuarios'
            }),
            m(Link, { href: '/usuarios/nuevo', text: 'Agregar Usuario' })
        ]);
    }
};

export default UsuarioListView;
