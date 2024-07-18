import Entities from '../config/Entities.js';

const Menu = {
    view: () => {
        return m("nav", 
            Object.keys(Entities).map(entity => 
                m(m.route.Link, { href: `/${entity}` }, Entities[entity].label)
            )
        );
    }
};

export default Menu;
