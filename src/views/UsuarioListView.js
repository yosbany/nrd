import Link from '../components/base/Link.js';
import OutputText from '../components/base/OutputText.js';
import Table from '../components/base/Table.js';
import FirebaseModel from '../models/FirebaseModel.js';


const UsuarioListView = {
    oninit: (vnode) => {
        vnode.state.items = [];
        FirebaseModel.getAll('usuarios').then(items => {
            vnode.state.items = items || [];
            m.redraw();
        });
    },
    view: (vnode) => {
        const items = vnode.state.items;

        const rows = items.map(item => [
            m(OutputText, { text: item.nombre }),
            m('td', [
                m(Link, { href: `/usuarios/editar/${item.id}`, text: 'Editar' }),
                m('span', ' | '),
                m('a', {
                    href: 'javascript:void(0)',
                    onclick: () => {
                        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                            FirebaseModel.delete('usuarios', item.id).then(() => {
                                vnode.state.items = vnode.state.items.filter(i => i.id !== item.id);
                                m.redraw();
                            });
                        }
                    }
                }, 'Eliminar')
            ])
        ]);

        return m('div', [
            m('h2', 'Lista de Usuarios'),
            m(Table, {
                headers: ['Nombre', 'Acciones'],
                rows: rows
            }),
            m(Link, { href: '/usuarios/nuevo', text: 'Agregar Usuario' })
        ]);
    }
};

export default UsuarioListView;
