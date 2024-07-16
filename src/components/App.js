import Menu from './Menu.js';

const App = {
    view: (vnode) => {
        return m('div', [
            m(Menu),
            m('div', { id: 'view-container' }, vnode.children)
        ]);
    }
};

export default App;
