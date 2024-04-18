// URL base de la API
const BASE_URL = 'https://nuevariodor.manager.io/api2';
//const AUTH_TOKEN = 'ChhURUpBUyBERSBMQSBDUlVaIFlPU0JBTlkSEgkcmw+K6+y8TRGQde/V+jCafhoSCbVL59K49CxNEaE2LyNtO3a+';
const AUTH_TOKEN = 'ChBURVNUIEVtcHJlc2EgQVBJEhIJ9jnZaIViL0kRorghRzrQp7YaEgkizVBbixU/TxGM5Pr+zwSOWQ==';

// Función para realizar solicitudes HTTP mediante fetch (GET)
async function getData(endpoint, options = {}) {
    try {
        const url = BASE_URL + endpoint;
        const headers = {
            'X-API-KEY': AUTH_TOKEN, // Utiliza la constante AUTH_TOKEN como token de autenticación
            ...options.headers
        };
        const response = await fetch(url, {
            ...options,
            headers
        });
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

async function getAccessTokens() {
    const endpoint = '/access-tokens';
    return await getData(endpoint);
}

