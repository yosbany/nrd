import FirebaseModel from '../models/FirebaseModel.js';
import Table from '../components/base/Table.js';
import Link from '../components/base/Link.js';
import VerticalLayout from '../components/base/VerticalLayout.js';
import OutputText from '../components/base/OutputText.js';
import HorizontalLayout from '../components/base/HorizontalLayout.js';

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

        return m(VerticalLayout, [
            m('h2', 'Lista de Usuarios'),
            m(Table, {
                headers: ['Nombre', 'Acciones'],
                rows: items.map(item => [
                    m(OutputText, { text: item.nombre }),
                    m(HorizontalLayout, [
                        m(Link, { href: `/usuarios/editar/${item.id}` }, 'Editar'),
                        m('span', ' | '),
                        m(Link, {
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
                ])
            }),
            m(Link, { href: '/usuarios/nuevo' }, 'Agregar Usuario')
        ]);
    }
};

export default UsuarioListView;
