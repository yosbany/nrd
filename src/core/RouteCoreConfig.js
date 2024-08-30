import LoginView from "../app/views/LoginView.js";
import ErrorView from "./ErrorView.js";
import NotFoundView from "./NotFoundView.js";
import UnauthorizedView from "./UnauthorizedView.js";

const RouteCoreConfig = {
    "/login": {
        render: vnode => m(LoginView, vnode.attrs)
    },
    "/unauthorized": {
        render: vnode => m(UnauthorizedView, vnode.attrs)
    },
    "/not-found": {
        render: vnode => m(NotFoundView, vnode.attrs)
    },
    "/error": {
        render: vnode => m(ErrorView, vnode.attrs)
    }
};

export default RouteCoreConfig;
