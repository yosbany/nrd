import Menu from './Menu.js';

const App = {
    view: vnode => {
        return m("div", [
            m(Menu),
            m("main", vnode.children)
        ]);
    }
};

export default App;
