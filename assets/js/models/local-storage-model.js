export default class LocalStorageModel {

    constructor() {
        this.versionKey = 'version';
        this.dataKey = 'LOCAL_STORAGE_NRD';
        this.currentVersion = this.getVersion();
        this.currentData = this.getData();
        this.initialData = this.getInitialData();
        if (this.currentVersion !== this.initialData.version) {
            this.updateData(this.initialData);
        }
    }

    getVersion() {
        return localStorage.getItem(this.versionKey);
    }

    updateVersion(newVersion) {
        localStorage.setItem(this.versionKey, newVersion);
        this.currentVersion = newVersion;
    }

    getInitialData() {
        const request = new XMLHttpRequest();
        request.open('GET', 'initial-data.json', false); 
        request.send(null);
        if (request.status === 200) {
            return JSON.parse(request.responseText);
        } else {
            throw new Error('Error al cargar el archivo JSON: ' + request.status);
        }
    }

    getData() {
        const dataString = localStorage.getItem(this.dataKey);
        return dataString ? JSON.parse(dataString) : {};
    }

    updateData(newData) {
        localStorage.setItem(this.dataKey, JSON.stringify(newData));
        this.currentData = newData;
    }

    getValue(key) {
        return this.currentData[key];
    }
}