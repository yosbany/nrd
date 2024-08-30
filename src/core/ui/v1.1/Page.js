import Breadcrumb from "./Breadcrumb.js";
import Grid from "./Grid.js";
import HeadingDivider from "./HeadingDivider.js";
import Container from "./Container.js";  // Importa el componente Container

const Page = {
    view: (vnode) => {
        const { title, breadcrumbs } = vnode.attrs;
        return m(Container, {}, [
            m(HeadingDivider, { title }),
            m(Breadcrumb, { items: breadcrumbs }),
            m("dic", vnode.children)
        ]);
    }
};

export default Page;
