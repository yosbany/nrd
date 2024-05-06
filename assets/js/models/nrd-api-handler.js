export default class NrdApiHandler {

    static baseUrl = 'https://192.168.1.2:443';

    static async getAllData() {
        try {
            const response = await this.get('data');
            return response;
        } catch (error) {
            console.error('Error getting all data:', error);
            return null;
        }
    }

    static async getDataById(id) {
        try {
            const response = await this.get(`data/${id}`);
            return response;
        } catch (error) {
            console.error('Error getting data by id:', error);
            return null;
        }
    }

    static async getDataByCode(code) {
        try {
            const response = await this.get(`data/code/${code}`);
            console.log("NrdApiHandler response: ", response);
            return response;
        } catch (error) {
            console.error('Error getting data by code:', error);
            return null;
        }
    }

    static async createData(code, jsonData) {
        try {
            const response = await this.post('data', { code, json_data: jsonData });
            return response;
        } catch (error) {
            console.error('Error creating data:', error);
            return null;
        }
    }

    static async updateData(id, jsonData) {
        try {
            const response = await this.put(`data/${id}`, { json_data: jsonData });
            return response;
        } catch (error) {
            console.error('Error updating data:', error);
            return null;
        }
    }

    static async deleteData(id) {
        try {
            const response = await this.delete(`data/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting data:', error);
            return false;
        }
    }

    static async get(endpoint) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = `${this.baseUrl}/${endpoint}`;
            
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        console.error('Error:', xhr.status);
                        reject(xhr.status);
                    }
                }
            };
            xhr.onerror = function() {
                console.error('Network error');
                reject('Network error');
            };
    
            // Desactivar la verificación del certificado SSL
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
            xhr.send();
        });
    }


    static async post(endpoint, data) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    static async put(endpoint, data) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    static async delete(endpoint) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'DELETE'
        });
        return response.ok;
    }
}
