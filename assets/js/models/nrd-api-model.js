export default class NrdApiModel
 {
    constructor() {
        this.baseUrl = 'http://192.168.1.2:8000';
    }

    async getAllCodes() {
        const response = await fetch(`${this.baseUrl}/data`);
        const data = await response.json();
        return data;
    }

    async getCodeData(code) {
        const response = await fetch(`${this.baseUrl}/data/${code}`);
        if (response.status === 404) {
            throw new Error('Code not found');
        }
        const data = await response.json();
        return data;
    }

    async addCode(code, jsonData) {
        const response = await fetch(`${this.baseUrl}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, json_data: jsonData })
        });
        const data = await response.json();
        return data;
    }

    async updateCode(code, jsonData) {
        const response = await fetch(`${this.baseUrl}/data/${code}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ json_data: jsonData })
        });
        const data = await response.json();
        return data;
    }

    async deleteCode(code) {
        const response = await fetch(`${this.baseUrl}/data/${code}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data;
    }
}