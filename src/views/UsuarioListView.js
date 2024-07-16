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
        const items = vnode.state.items.filter(item =>
            item.nombre.toLowerCase().includes(vnode.state.searchTerm.toLowerCase())
        );

        return m(VerticalLayout, [
            m('h2', 'Lista de Usuarios'),
            m(InputText, {
                label: 'Buscar',
                value: vnode.state.searchTerm,
                oninput: (e) => vnode.state.searchTerm = e.target.value
            }),
            m(Table, {
                headers: ['Nombre', 'Acciones'],
                rows: items.map(item => [
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
                ])
            }),
            m(Link, { href: '/usuarios/nuevo', text: 'Agregar Usuario' })
        ]);
    }
};

export default UsuarioListView;
