export default class LocalStorageModel {

    constructor() {
        this.key = "NRD_DATA_LOCAL";
        this.data = this.loadData();
    }

    // Cargar datos del almacenamiento local
    loadData() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : {};
    }

    // Guardar datos en el almacenamiento local
    saveData() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }

    // Obtener un valor específico
    getValue(key) {
        return this.data[key];
    }

    // Establecer un valor específico
    setValue(key, value) {
        this.data[key] = value;
        this.saveData();
    }

    // Eliminar un valor específico
    deleteValue(key) {
        delete this.data[key];
        this.saveData();
    }

    // Obtener todos los datos
    getAllData() {
        return this.data;
    }

    // Limpiar todos los datos
    clearAllData() {
        localStorage.removeItem(this.key);
        this.data = {};
    }
}