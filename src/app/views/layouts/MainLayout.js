import Container from '../../../core/ui/Container.js'
import Fila from '../../../core/ui/Fila.js'
import Column from '../../../core/ui/Column.js'
import Menu from '../partials/Menu.js'

const MainLayout = {
    view: vnode => {
        return m(Container, { size: 'expand' }, [
            m(Menu),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '12' }, [
                    vnode.children
                ])
            ])
        ]);
    }
};

export default MainLayout;
