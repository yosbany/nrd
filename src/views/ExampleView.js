import NavTabs from '../components/base/NavTabs.js';
import InputText from '../components/base/InputText.js';
import Button from '../components/base/Button.js';

const ExampleView = {
    oninit: (vnode) => {
        vnode.state.newItem = '';
    },
    view: (vnode) => {
        const { newItem } = vnode.state;

        return m('div', { class: 'container' }, [
            m(NavTabs, {
                tabs: [
                    { 
                        label: 'Agregar', 
                        active: true, 
                        content: m('div', [
                            m('h3', 'Agregar Nuevo Elemento'),
                            m(InputText, {
                                label: 'Nombre',
                                value: newItem,
                                onchange: (e) => vnode.state.newItem = e.target.value
                            }),
                            m(Button, {
                                label: 'Agregar',
                                onclick: () => {
                                    alert(`Elemento agregado: ${newItem}`);
                                    vnode.state.newItem = ''; // Limpiar el input
                                }
                            })
                        ]) 
                    },
                    { 
                        label: 'Lista', 
                        content: m('div', 'Aquí va la lista de elementos') 
                    }
                ]
            })
        ]);
    }
};

export default ExampleView;
