import Container from '../../../core/ui/Container.js'
import Fila from '../../../core/ui/Fila.js'
import Column from '../../../core/ui/Column.js'
import Menu from '../partials/Menu.js'

const MainLayout = {
    view: vnode => {
        return m(Container, { size: 'expand', fullHeight: true }, [
            m(Menu),
            m(Fila, { gap: 'medium', fullHeight: true }, [
                m(Column, { width: '1-1', fullHeight: true }, [
                    vnode.children
                ])
            ])
        ]);
    }
};

export default MainLayout;


