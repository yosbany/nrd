import CodiguerasController from '../controllers/CodiguerasController.js';
import Breadcrumb from '../../core/ui/Breadcrumb.js';
import Fila from '../../core/ui/Fila.js';
import Column from '../../core/ui/Column.js';
import Card from '../../core/ui/Card.js';
import Text from '../../core/ui/Text.js'; 

const CodiguerasView = {
    oninit: vnode => {
        CodiguerasController.oninit(vnode);
        vnode.state.codigueraName = '';
        vnode.state.codigueraParent = '';
        vnode.state.filterText = '';
    },

    // Función para editar una codiguera y actualizar el formulario
    editCodiguera: (codiguera, vnode) => {
        vnode.state.codigueraName = codiguera.name;
        vnode.state.codigueraParent = codiguera.parent;
        CodiguerasController.selectedCodiguera = codiguera.id;

        // Desplazar al inicio del formulario de edición
        const formStart = document.getElementById('form-start');
        if (formStart) formStart.scrollIntoView({ behavior: 'smooth' });
    },

    // Reseteamos el formulario al estado inicial
    resetForm: vnode => {
        vnode.state.codigueraName = '';
        vnode.state.codigueraParent = '';
        CodiguerasController.selectedCodiguera = null;
    },

    // Cargamos las opciones de parentKey solo si no se han cargado ya
    loadOptions: vnode => {
        if (!vnode.state.optionsLoaded && CodiguerasController.codigueras.length > 0) {
            vnode.state.options = [
                { label: 'Ninguno', value: '' },
                ...CodiguerasController.codigueras
                    .filter(c => c.id !== CodiguerasController.selectedCodiguera) // Evitamos referenciar a sí misma
                    .map(c => ({ label: c.name, value: c.id }))
            ];
            vnode.state.optionsLoaded = true;
        }
    },

    view: vnode => {
        const breadcrumbItems = [
            { name: "Inicio", path: "/" },
            { name: "Codigueras", path: "/codigueras" },
            { name: CodiguerasController.selectedCodiguera ? "Editar" : "Nuevo", path: m.route.get() }
        ];

        return m(Card, { title: "Codigueras", useCustomPadding: true }, [
            m(Breadcrumb, { items: breadcrumbItems }),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '1-1' }, [
                    m('div', { id: 'form-start' }),
                    m(Text, {
                        placeholder: 'Nombre',
                        value: vnode.state.codigueraName,
                        oninput: e => vnode.state.codigueraName = e.target.value,
                        showLabel: false
                    }),
                    m(Text, {
                        placeholder: 'Padre',
                        value: vnode.state.codigueraParent,
                        oninput: e => vnode.state.codigueraParent = e.target.value,
                        showLabel: false
                    }),
                    m('button.uk-button.uk-button-primary.uk-margin-top', {
                        onclick: () => {
                            const newCodiguera = { 
                                name: vnode.state.codigueraName,
                                parent: vnode.state.codigueraParent 
                            };
                            if (CodiguerasController.selectedCodiguera) {
                                CodiguerasController.editCodiguera(CodiguerasController.selectedCodiguera, newCodiguera);
                                // Desplazar al final del formulario cuando se agrega una nueva codiguera
                                const elementItem = document.getElementById(vnode.state.codigueraValue);
                                if (elementItem) elementItem.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                CodiguerasController.addCodiguera(newCodiguera);
                                // Desplazar al final del formulario cuando se agrega una nueva codiguera
                                const listEnd = document.getElementById('list-end');
                                if (listEnd) listEnd.scrollIntoView({ behavior: 'smooth' });
                            }
                            CodiguerasView.resetForm(vnode);
                        }
                    }, CodiguerasController.selectedCodiguera ? 'Guardar Cambios' : 'Agregar Codiguera'),
                    m("div", { id: 'form-end' }), // Ancla para el final del formulario de agregar nuevo
                    m("hr"),
                    m(Column, { width: '1-1' }, [
                        // Filtro de búsqueda
                        m(Text, {
                            placeholder: 'Buscar por nombre o padre...',
                            value: vnode.state.filterText,
                            oninput: e => {
                                vnode.state.filterText = e.target.value;
                                m.redraw();
                            },
                            showLabel: false
                        }),
                        m("hr"),
                        m('ul.uk-list.uk-list-striped', 
                            CodiguerasController.applyFilter(vnode).map(codiguera => {
                                const parentCodiguera = CodiguerasController.codigueras.find(c => c.name === codiguera.parent);
                                return m('li', { 
                                    style: { 
                                        display: 'grid', 
                                        gridTemplateColumns: '2fr 2fr 3fr', 
                                        alignItems: 'center',
                                        gap: '1rem'
                                    } 
                                }, [
                                    m('span', {id: codiguera.name}, `${codiguera.name}`),
                                    m('span', `Padre: ${parentCodiguera ? `${parentCodiguera.name}` : ''}`),
                                    m('span', { style: { textAlign: 'right' } }, [
                                        m('a.uk-link-muted', {
                                            href: '#',
                                            onclick: (e) => {
                                                e.preventDefault();
                                                CodiguerasView.editCodiguera(codiguera, vnode);
                                            }
                                        }, 'Editar'),
                                        m('span', ' | '), // Separador entre los links
                                        m('a.uk-link-muted', {
                                            href: '#',
                                            onclick: (e) => {
                                                e.preventDefault();
                                                CodiguerasController.deleteCodiguera(codiguera.id);
                                            }
                                        }, 'Eliminar')
                                    ])
                                ]);
                            })
                        ),
                        m("div", { id: 'list-end' })
                    ]),
                    m("div", { id: 'list-end' }),
                ])
            ])
        ]);
    }
};

export default CodiguerasView;
