import { ref, set, get, push, remove } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';
import { db } from './firebase.js';
import Entities from '../config/Entities.js';
import ValidationModel from '../models/ValidationModel.js';

const resolveReferences = async (data) => {
    const promises = [];
    const resolveRef = async (obj, key) => {
        const parts = key.split('Ref');
        if (parts.length === 2) {
            const entity = parts[1];
            if (typeof obj[key] === 'string') {
                const refPath = obj[key];
                const snapshot = await get(ref(db, refPath));
                if (snapshot.exists()) {
                    obj[key] = snapshot.val();
                }
            } else if (Array.isArray(obj[key])) {
                const resolvedArray = await Promise.all(obj[key].map(async (refPath) => {
                    if (typeof refPath === 'string') {
                        const snapshot = await get(ref(db, refPath));
                        return snapshot.exists() ? snapshot.val() : null;
                    } else if (typeof refPath === 'object' && refPath !== null) {
                        await traverseAndResolve(refPath);
                        return refPath;
                    }
                    return null;
                }));
                obj[key] = resolvedArray.filter(item => item !== null);
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (Array.isArray(obj[key])) {
                const resolvedArray = await Promise.all(obj[key].map(async (item) => {
                    if (typeof item === 'object' && item !== null) {
                        await traverseAndResolve(item);
                    }
                    return item;
                }));
                obj[key] = resolvedArray;
            } else {
                await traverseAndResolve(obj[key]);
            }
        }
    };

    const traverseAndResolve = async (obj) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                await resolveRef(obj, key);
            }
        }
    };

    await traverseAndResolve(data);
    return data;
};

const FirebaseModel = {
    getAll: async (entity) => {
        console.log("[Audit][FirebaseModel] Fetching all data for entity:", entity);
        const entityRef = ref(db, entity);
        try {
            const snapshot = await get(entityRef);
            const data = snapshot.val();
            if (!data) {
                console.log("[Audit][FirebaseModel] No data found for entity:", entity);
                return [];
            }
            const items = Object.keys(data).map(async key => {
                const item = { id: key, ...data[key] };
                await resolveReferences(item); // Resolve references
                return item;
            });
            const result = await Promise.all(items);
            console.log("[Audit][FirebaseModel] Fetched data for entity:", entity, result);
            return result;
        } catch (error) {
            console.error("[Audit][FirebaseModel] Error fetching data for entity:", entity, error);
            throw error;
        }
    },

    getById: async (entity, id) => {
        console.log("[Audit][FirebaseModel] Fetching data for entity:", entity, "with id:", id);
        const entityRef = ref(db, `${entity}/${id}`);
        try {
            const snapshot = await get(entityRef);
            if (!snapshot.exists()) {
                throw new Error(`No data found for id: ${id}`);
            }
            const result = { id: snapshot.key, ...snapshot.val() };
            await resolveReferences(result); // Resolve references
            console.log("[Audit][FirebaseModel] Fetched data for entity:", entity, "with id:", id, result);
            return result;
        } catch (error) {
            console.error("[Audit][FirebaseModel] Error fetching data for entity:", entity, "with id:", id, error);
            throw error;
        }
    },

    saveOrUpdate: async (entity, id, data) => {
        console.log("[Audit][FirebaseModel] Saving or updating entity:", entity, "with id:", id, "data:", data);

        // Validar los datos usando ValidationModel
        const entitySchema = Entities[entity]?.properties || {};
        const errors = ValidationModel.validateEntityData(data, entitySchema);

        if (Object.keys(errors).length > 0) {
            console.error("[Audit][FirebaseModel] Validation errors:", errors);
            throw new Error(`Validation errors: ${JSON.stringify(errors)}`);
        }

        const processedData = {};
        for (const key in data) {
            const parts = key.split('Ref');
            if (parts.length === 2) {
                const entityName = parts[1];
                const refValue = data[key];

                if (typeof refValue === 'string') {
                    processedData[key] = `${entityName}/${refValue}`;
                } else if (Array.isArray(refValue)) {
                    processedData[key] = refValue.map(id => `${entityName}/${id}`);
                }
            } else {
                processedData[key] = data[key];
            }
        }

        delete processedData.id;

        const entityRef = id ? ref(db, `${entity}/${id}`) : ref(db, entity);
        try {
            if (id) {
                await set(entityRef, processedData);
                console.log("[Audit][FirebaseModel] Updated entity:", entity, "with id:", id, processedData);
                return { id, ...processedData };
            } else {
                const newRef = await push(entityRef, processedData);
                const result = { id: newRef.key, ...processedData };
                console.log("[Audit][FirebaseModel] Created new entity:", entity, result);
                return result;
            }
        } catch (error) {
            console.error("[Audit][FirebaseModel] Error saving entity:", entity, "with id:", id, error);
            throw error;
        }
    },

    delete: async (entity, id) => {
        console.log("[Audit][FirebaseModel] Deleting entity:", entity, "with id:", id);
        const entityRef = ref(db, `${entity}/${id}`);
        try {
            await remove(entityRef);
            console.log("[Audit][FirebaseModel] Deleted entity:", entity, "with id:", id);
            return { id };
        } catch (error) {
            console.error("[Audit][FirebaseModel] Error deleting entity:", entity, "with id:", id, error);
            throw error;
        }
    }
};

export default FirebaseModel;
