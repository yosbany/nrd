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

    async getDataResponse(response) {
        if (Array.isArray(response)) {
            return response.map(item => {
                const jsonData = JSON.parse(item.json_data);
                jsonData._id = item.id;
                jsonData._code = item.code;
                return jsonData;
            });
        } else if (typeof response === 'object') {
            const jsonData = JSON.parse(response.json_data);
            jsonData._id = response.id;
            jsonData._code = response.code;
            return jsonData;
        }
        return null;
    }

    async getAllData() {
        try {
            await this.syncDataWithAPI();
            const apiData = await NrdApiHandler.getAllData();
            if (apiData.length > 0) {
                LocalStorageHandler.saveAllData(apiData);
            }
            return this.getDataResponse(apiData);
        } catch (error) {
            console.error('Error getting data from API:', error);
            const localData = LocalStorageHandler.getAllData();
            return this.getDataResponse(localData);
        }
    }

    async getDataById(id) {
        try {
            await this.syncDataWithAPI();
            const apiData = await NrdApiHandler.getDataById(id);
            return this.getDataResponse(apiData);
        } catch (error) {
            console.error('Error getting data by ID from API:', error);
            const localData = LocalStorageHandler.getDataById(id);
            return this.getDataResponse(localData);
        }
    }

    async getDataByCode(code) {
        try {
            await this.syncDataWithAPI();
            const apiData =  await NrdApiHandler.getDataByCode(code);
            return this.getDataResponse(apiData);
        } catch (error) {
            console.error('Error getting data by code from API:', error);
            const localData = LocalStorageHandler.getDataByCode(code);
            return this.getDataResponse(localData);
        }
    }

    async createData(code, jsonData) {
        try {
            const apiCreatedData = await NrdApiHandler.createData(code, jsonData);
            LocalStorageHandler.getAllData();
            await this.syncDataWithAPI();
            return this.getDataResponse(apiCreatedData);
        } catch (error) {
            console.error('Error creating data in API:', error);
            const localCreatedData = LocalStorageHandler.createData(code, jsonData);
            return this.getDataResponse(localCreatedData);;
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
            const apiUpdatedData = await NrdApiHandler.updateData(id, jsonData);
            LocalStorageHandler.getAllData();
            await this.syncDataWithAPI();
            return this.getDataResponse(apiUpdatedData);
        } catch (error) {
            console.error('Error updating data in API:', error);
            const localUpdatedData = LocalStorageHandler.updateData(id, jsonData);
            return this.getDataResponse(localUpdatedData);
        }
    }

    async syncDataWithAPI() {
        try {
            const localData = LocalStorageHandler.getAllDataSinFilter();
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
