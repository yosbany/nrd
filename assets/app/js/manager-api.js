// URL base de la API
const BASE_URL = 'https://nuevariodor.manager.io/api2';

// Función para realizar solicitudes HTTP mediante fetch (GET)
async function getData(endpoint, options = {}) {
    try {
        const url = BASE_URL + endpoint;
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Función para enviar datos mediante fetch (POST)
async function postData(endpoint, body, options = {}) {
    try {
        const url = BASE_URL + endpoint;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            ...options,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error posting data:', error);
        return null;
    }
}

// Función para actualizar datos mediante fetch (PUT)
async function putData(endpoint, body, options = {}) {
    try {
        const url = BASE_URL + endpoint;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            ...options,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating data:', error);
        return null;
    }
}

// Función para eliminar datos mediante fetch (DELETE)
async function deleteData(endpoint, options = {}) {
    try {
        const url = BASE_URL + endpoint;
        const response = await fetch(url, {
            method: 'DELETE',
            ...options,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('Error deleting data:', error);
        return false;
    }
}
//Operaciones 

export async function getAccessTokens() {
    const endpoint = '/access-tokens';
    return await getData(endpoint);
}

