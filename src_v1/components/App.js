import Menu from './components/Menu.js';

const App = {
    view: function(vnode) {
        return m("div", [
            m(Menu),
            m("div.pure-g", [
                m("div.pure-u-1", vnode.children)
            ])
        ]);
    }
};