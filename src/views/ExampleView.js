import NavTabs from '../components/base/NavTabs.js';
import InputText from '../components/base/InputText.js';
import Button from '../components/base/Button.js';
import VerticalLayout from '../components/base/VerticalLayout.js';

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
                        label: 'Inicio', 
                        active: true, 
                        content: m(VerticalLayout, [
                            m(InputText, { label: 'Ejemplo Inicio' }),
                            m(Button, {
                                label: 'Enviar',
                                onclick: () => alert(`Inicio: ${newItem}`)
                            })
                        ]) 
                    },
                    { 
                        label: 'Órdenes', 
                        content: m(VerticalLayout, [
                            m(InputText, { label: 'Ejemplo Órdenes' }),
                            m(Button, {
                                label: 'Enviar',
                                onclick: () => alert(`Órdenes: ${newItem}`)
                            })
                        ]) 
                    }
                ]
            })
        ]);
    }
};

export default ExampleView;
