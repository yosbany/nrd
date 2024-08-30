import Logger from "../app/utils/Logger.js";

const ErrorBoundary = {
    oninit(vnode) {
        vnode.state.hasError = false;
        vnode.state.error = null;
    },
    view(vnode) {
        if (vnode.state.hasError) {
            // Registra el error antes de redirigir
            Logger.error('Redirigiendo a /error debido a un error en el componente:', vnode.state.error);

            // Redirigir a la ruta '/error'
            m.route.set('/error', { message: vnode.state.error ? vnode.state.error.message : 'Ocurrió un error inesperado.' });
            return null; // No renderizar nada más ya que estamos redirigiendo
        }
        return vnode.children; // Renderiza los hijos normalmente si no hay errores
    },
    onerror(error, vnode) {
        vnode.state.hasError = true;
        vnode.state.error = error;

        // Registrar el error
        Logger.error('Error en el componente capturado por ErrorBoundary:', error);

        m.redraw(); // Forzar un redibujado para activar la redirección en view()
    }
};

export default ErrorBoundary;
