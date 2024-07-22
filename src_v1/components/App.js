import Menu from './Menu.js';

const App = {
    view: vnode => {
        return m("div", [
            m(Menu),
            m("main.div.content", vnode.children)
        ]);
    }
};

export default App