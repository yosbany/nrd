import Menu from './Menu.js';
import VerticalLayout from './base/VerticalLayout.js';

const App = {
    view: ({ children }) => {
        return m(VerticalLayout, [
            m(Menu),
            m('div', { class: 'container' }, children)
        ]);
    }
};

export default App;
