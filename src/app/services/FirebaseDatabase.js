import { getDatabase, ref, get, set, remove, child, push } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';
import FirebaseAppConfig from '../config/FirebaseAppConfig.js';
import Logger from '../utils/Logger.js';
import { validateId } from '../utils/Helpers.js'

const FirebaseDatabase = {
    database: getDatabase(FirebaseAppConfig), // Inicializa la instancia de la base de datos directamente
    
    // Encuentra un registro por su ID
    async findById(id) {
        Logger.info(`[FirebaseDatabase] Iniciando búsqueda por ID: ${id}`);
        try {
            validateId(id);
            const dbRef = ref(FirebaseDatabase.database, id);
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                Logger.info(`[FirebaseDatabase] Registro encontrado con ID: ${id}`, data);
                return data;
            } else {
                Logger.warn(`[FirebaseDatabase] No se encontró el registro con ID: ${id}`);
                return null;
            }
        } catch (error) {
            Logger.error('[FirebaseDatabase] Error al buscar por ID:', error);
            throw error;
        }
    },

    // Encuentra todos los registros en una colección
    async findAll(collection) {
        Logger.info(`[FirebaseDatabase] Iniciando búsqueda de todos los registros en la colección: ${collection}`);
        try {
            const dbRef = ref(FirebaseDatabase.database, collection);
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const sanitizedData = Object.keys(data).map(key => {
                    return data[key];
                });
                
                Logger.info(`[FirebaseDatabase] Registros encontrados en la colección: ${collection}`, sanitizedData);
                return sanitizedData;
            } else {
                Logger.warn(`[FirebaseDatabase] No se encontraron registros en la colección: ${collection}`);
                return [];  // Devuelve un array vacío si no se encuentran registros
            }
        } catch (error) {
            Logger.error('[FirebaseDatabase] Error al buscar todos los registros:', error);
            return [];  // Devuelve un array vacío en caso de error
        }
    },

    // Guarda o actualiza un registro
    async save(collection, id, data) {
        Logger.info(`[FirebaseDatabase] Iniciando guardado/actualización en la colección: ${collection} con ID: ${id || 'nuevo'}`, data);
        try {
            let dbRef;

            if (!id) {
                dbRef = ref(FirebaseDatabase.database, collection);
                const newRef = push(dbRef);
                id = `${collection}/${newRef.key}`;
                data.id = id;
                dbRef = newRef;
            } else {
                dbRef = ref(FirebaseDatabase.database, id);
            }
            validateId(id);
            await set(dbRef, data);
            Logger.info(`[FirebaseDatabase] Registro guardado/actualizado en la colección: ${collection} con ID: ${id}`, data);

            return id;
        } catch (error) {
            Logger.error('[FirebaseDatabase] Error al guardar/actualizar el registro:', error);
            throw error;
        }
    },

    // Elimina un registro por su ID
    async delete(id) {
        Logger.info(`[FirebaseDatabase] Iniciando eliminación del registro con ID: ${id}`);
        try {
            validateId(id);
            const dbRef = ref(FirebaseDatabase.database, id);
            await remove(dbRef);
            Logger.info(`[FirebaseDatabase] Registro eliminado con ID: ${id}`);
        } catch (error) {
            Logger.error('[FirebaseDatabase] Error al eliminar el registro:', error);
            throw error;
        }
    }
};

export default FirebaseDatabase;
