import Breadcrumb from "./Breadcrumb.js";
import HeadingDivider from "./HeadingDivider.js";
import Container from "./Container.js";
import Loading from "../../../app/views/partials/Loading.js"; 

const Page = {
    view: (vnode) => {
        const { title, breadcrumbs } = vnode.attrs;
        return m(Container, { class: "page-container" }, [
            m(Loading, { loading: vnode.state.loading }),
            m(HeadingDivider, { title }),
            breadcrumbs && breadcrumbs.length > 0 ? m(Breadcrumb, { items: breadcrumbs }) : null,
            m("div", vnode.children)
        ]);
    }
};

export default Page;
