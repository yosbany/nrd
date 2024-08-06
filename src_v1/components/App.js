import Menu from './Menu.js';
import ValidationModel from '../models/ValidationModel.js';
import Entities from '../config/Entities.js';
import Container from './base/Container.js';
import Fila from './base/Fila.js';
import Column from './base/Column.js';

const App = {
    oninit: vnode => {
        console.log("[Audit][App] Initializing...");

        // Validación de esquemas de entidades
        vnode.state.errores = ValidationModel.validateEntitiesSchema(Entities);

        if (vnode.state.errores.length > 0) {
            console.error("[Audit][App] Errors detected in entity schemas:", vnode.state.errores);
        } else {
            console.log("[Audit][App] All entity schemas validated successfully.");
        }
    },

    view: vnode => {
        const { errores } = vnode.state;

        if (errores.length > 0) {
            return m(Container, [
                m(Fila, { gap: 'medium' }, [
                    m(Column, { width: '12' }, [
                        m("div.uk-alert-danger", { 'uk-alert': true }, [
                            m("h1.uk-heading-bullet", "Errores de Validación de Esquemas"),
                            m("ul.uk-list",
                                errores.map(error => m("li", error))
                            )
                        ])
                    ])
                ])
            ]);
        }

        return m(Container, { size: 'expand'}, [
            m(Menu),
            m(Fila, { gap: 'medium' }, [
                m(Column, { width: '12' }, [
                    vnode.children
                ])
            ])
        ]);
    }
};

export default App;
