import Container from '../../../core/ui/v1.1/Container.js';
import Menu from '../partials/Menu.js'

const MainLayout = {
    view: vnode => {
        return m(Container, {}, [
            m(Menu),
            m("div", vnode.children)
        ]);
    }
};

export default MainLayout;


