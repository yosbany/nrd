import {Menu} from './Menu.js';

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
