export default class LocalStorageHandler {

    static getAllDataSinFilter() {
       return  JSON.parse(localStorage.getItem('data')) || [];
    }
    
    static getAllData() {
        const data = JSON.parse(localStorage.getItem('data')) || [];
        // Filtrar elementos marcados como eliminados
        return data.filter(item => !item.isDeleted);
    }
    
    static getDataById(id) {
        const data = this.getAllData().find(item => item.id === id && !item.isDeleted);
        return data;
    }

    static getDataByCode(code) {
        const data = this.getAllData().filter(item => item.code === code && !item.isDeleted);
        console.log("LocalStorageHandler response: ", data);
        return data;
    }

    static saveAllData(apiData) {
        const localData = this.getAllData();
        const updatedData = apiData.map(apiItem => {
            const localItem = localData.find(local => local.id === apiItem.id);
            if (localItem) {
                // Si el elemento existe localmente y está marcado como modificado o eliminado, mantener los cambios locales
                if (localItem.isModified || localItem.isDeleted) {
                    return { ...apiItem, ...localItem };
                } else {
                    // Si no está marcado como modificado o eliminado, sobrescribir con los datos de la API
                    return apiItem;
                }
            } else {
                // Si el elemento no existe localmente, mantener los datos de la API
                return apiItem;
            }
        });
        localStorage.setItem('data', JSON.stringify(updatedData));
    }
    

    static createData(code, jsonData) {
        const data = {
            code: code,
            json_data: jsonData,
            isModified: true
        };
        const allData = this.getAllData();
        allData.push(data);
        localStorage.setItem('data', JSON.stringify(allData));
        return data;
    }

    static updateData(id, jsonData) {
        let allData = this.getAllData();
        const index = allData.findIndex(item => item.id === id);
        if (index !== -1) {
            allData[index].json_data = jsonData;
            allData[index].isModified = true;
            localStorage.setItem('data', JSON.stringify(allData));
            return allData[index];
        } else {
            return null;
        }
    }

    static deleteData(id) {
        let allData = this.getAllData();
        const index = allData.findIndex(item => item.id === id);
        if (index !== -1) {
            allData[index].isDeleted = true;
            localStorage.setItem('data', JSON.stringify(allData));
            return true;
        } else {
            return false;
        }
    }
}
