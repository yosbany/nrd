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
        const articulos = await FirebaseServiceInstance.getData(DataPersistenceModel.ENTITIES.ARTICULOS);
        // Filtrar los artículos que contienen el proveedor específico
        const filtered = Object.values(articulos).filter(articulo => {
            return Array.isArray(articulo.proveedores) && articulo.proveedores.includes(proveedor);
        });
        return filtered;
    }

    async saveMovimiento(movimiento){
        const movimientos = await FirebaseServiceInstance.getData(DataPersistenceModel.ENTITIES.MOVIMIENTOS, []);
        movimientos.push(movimiento);
        await FirebaseServiceInstance.saveData(DataPersistenceModel.ENTITIES.MOVIMIENTOS, movimientos);
    }

}
