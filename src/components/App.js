import Menu from './Menu.js';
import VerticalLayout from './base/VerticalLayout.js';

const App = {
    view: () => {
        return m(VerticalLayout, [
            m(Menu),
            m('div', { class: 'container' }, [

            ])  
        ]);
    }
};

export default App;
