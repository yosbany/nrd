import LocalStorageHandler from "./local-storage-handler.js";
import NrdApiHandler from "./nrd-api-handler.js";



export default class DataPersistenceModel {
    constructor() {

    }
    static ENTITIES = {
        PROVEEDOR: 'PROVEEDOR',
        CLIENTE: 'CLIENTE',
        ARTICULO: 'ARTICULO',
        NOMINA: 'NOMINA',
        MOVIMIENTO: 'MOVIMIENTO',
        RECETA: 'RECETA',
        TAREA: 'TAREA',
        EMPLEADO: 'EMPLEADO',
        PEDIDO: 'PEDIDO'
    }

    async getAllData() {
        try {
            await this.syncDataWithAPI();
            const apiData = await NrdApiHandler.getAllData();
            if (apiData.length > 0) {
                LocalStorageHandler.saveAllData(apiData);
            }
            return apiData;
        } catch (error) {
            console.error('Error getting data from API:', error);
            return LocalStorageHandler.getAllData();
        }
    }

    async getDataById(id) {
        try {
            await this.syncDataWithAPI();
            return await NrdApiHandler.getDataById(id);
        } catch (error) {
            console.error('Error getting data by ID from API:', error);
            return LocalStorageHandler.getDataById(id);
        }
    }

    async getDataByCode(code) {
        try {
            await this.syncDataWithAPI();
            return await NrdApiHandler.getDataByCode(code);
        } catch (error) {
            console.error('Error getting data by code from API:', error);
            return LocalStorageHandler.getDataByCode(code);
        }
    }

    async createData(code, jsonData) {
        try {
            const createdData = await NrdApiHandler.createData(code, jsonData);
            LocalStorageHandler.getAllData();
            await this.syncDataWithAPI();
            return createdData;
        } catch (error) {
            console.error('Error creating data in API:', error);
            const createdData = LocalStorageHandler.createData(code, jsonData);
            return createdData;
        }
    }

    async deleteData(id) {
        try {
            const deleted = await NrdApiHandler.deleteData(id);
            LocalStorageHandler.getAllData();
            await this.syncDataWithAPI();
            return deleted;
        } catch (error) {
            console.error('Error deleting data in API:', error);
            const deleted = LocalStorageHandler.deleteData(id);
            return deleted;
        }
    }

    async updateData(id, jsonData) {
        try {
            const updatedData = await NrdApiHandler.updateData(id, jsonData);
            LocalStorageHandler.getAllData();
            await this.syncDataWithAPI();
            return updatedData;
        } catch (error) {
            console.error('Error updating data in API:', error);
            const updatedData = LocalStorageHandler.updateData(id, jsonData);
            return updatedData;
        }
    }

    async syncDataWithAPI() {
        try {
            const localData = LocalStorageHandler.getAllData();
            for (const data of localData) {
                try {
                    if (data.id) {
                        // Elemento existente en local, sincronizar con la API
                        if (data.isDeleted) {
                            // Eliminar elemento en la API si está marcado como eliminado
                            await NrdApiHandler.deleteData(data.id);
                        } else {
                            // Actualizar elemento en la API si no está marcado como eliminado
                            await NrdApiHandler.updateData(data.id, data.json_data);
                        }
                    } else {
                        // Elemento nuevo en local, crear en la API
                        const createdData = await NrdApiHandler.createData(data.code, data.json_data);
                        // Actualizar ID del elemento en local con el ID asignado por la API
                        data.id = createdData.id;
                    }
                    // Eliminar la marca de modificado o eliminado
                    delete data.isModified;
                    delete data.isDeleted;
                } catch (error) {
                    console.error('Error synchronizing data with API:', error);
                    // Continuar con el siguiente elemento si ocurre un error
                    continue;
                }
            }
            // Guardar los datos actualizados en el almacenamiento local
            LocalStorageHandler.saveAllData(localData);
            console.log('Data synchronized successfully with API.');
        } catch (error) {
            console.error('Error synchronizing data with API:', error);
        }
    }

}
