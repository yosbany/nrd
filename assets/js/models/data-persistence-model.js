import FirebaseServiceInstance from "../../../services/firebase-service.js";

export default class DataPersistenceModel {
    constructor() {

    }
    static ENTITIES = {
        PROVEEDORES: 'proveedores',
        CLIENTES: 'clientes',
        ARTICULOS: 'articulos',
        NOMINAS: 'nominas',
        MOVIMIENTOS: 'movimientos',
        RECETAS: 'recetas',
        TAREAS: 'tareas',
        EMPLEADOS: 'empleados',
        PEDIDOS: 'pedidos'
    }

    async getProveedores() {
        return await FirebaseServiceInstance.getData(DataPersistenceModel.ENTITIES.PROVEEDORES);
    }

    async getArticulosXProveedor(proveedor) {
        return await FirebaseServiceInstance.getCollection(DataPersistenceModel.ENTITIES.ARTICULOS).where("proveedores", "array-contains", proveedor).get();
    }

}
