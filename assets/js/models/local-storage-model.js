import data from "./initial-data";


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
       return data;
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