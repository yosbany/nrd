import Menu from './Menu.js';

const App = {
    view: (vnode) => {
        return m('div', { class: 'container' }, [
            m(Menu),
            m('div', { id: 'view-container' }, vnode.children)
        ]);
    }
};

export default App;
