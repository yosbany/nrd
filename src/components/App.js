import Menu from './Menu.js';
import VerticalLayout from './base/VerticalLayout.js';

const App = {
    view: ({ children }) => {
        return m(VerticalLayout, [
            m(Menu),
            m('div', { class: 'full-screen-container' }, children.map(child => 
                m('div', { class: 'child-container' }, child)
            ))
        ]);
    }
};

export default App;
