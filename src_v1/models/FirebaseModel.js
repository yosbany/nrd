import { ref, set, get, push, remove } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';
import { db } from './firebase.js';
import ValidationModel from '../models/ValidationModel.js';

const ResolveReferences = async (data) => {
    const traverseAndResolve = async (obj) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const property = obj[key];

                if (key.endsWith('Key') && typeof property === 'string') {
                    //console.log(`[Audit][ResolveReferences] Resolving reference for key: ${key}, path: ${property}`);
                    const resolvedObject = await FirebaseModel.getById(property, false);
                    obj[key] = resolvedObject;
                    //console.log(`[Audit][ResolveReferences] Reference resolved for key: ${key}, resolved object:`, obj[key]);
                } else if (key.endsWith('Key') && Array.isArray(property)) {
                    //console.log(`[Audit][ResolveReferences] Resolving array of references for key: ${key}`);
                    const resolvedArray = await Promise.all(property.map(async (refValue) => {
                        if (typeof refValue === 'string') {
                            //console.log(`[Audit][ResolveReferences] Resolving reference in array for path: ${refValue}`);
                            const resolvedObject = await FirebaseModel.getById(refValue, false);
                            return resolvedObject;
                        } else if (typeof refValue === 'object' && refValue !== null) {
                            await traverseAndResolve(refValue);
                            return refValue;
                        }
                        return null;
                    }));
                    obj[key] = resolvedArray.filter(item => item !== null);
                    //console.log(`[Audit][ResolveReferences] Resolved array for key: ${key}, resolved array:`, obj[key]);
                } else if (typeof property === 'object' && property !== null) {
                    console.log(`[Audit][ResolveReferences] Traversing object for key: ${key}`);
                    await traverseAndResolve(property);
                }
            }
        }
    };

    //console.log("[Audit][ResolveReferences] Starting to resolve references for data:", data);
    await traverseAndResolve(data);
    //console.log("[Audit][ResolveReferences] Finished resolving references, final data:", data);
    return data;
};

const convertIsoStringsToDates = (data) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            // Comprobar si la cadena es un formato de fecha ISO válido
            const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
            if (typeof value === 'string' && isoDatePattern.test(value)) {
                data[key] = new Date(value);
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                convertIsoStringsToDates(value); // Recursivamente convertir fechas en objetos anidados
            }
        }
    }
};

const FirebaseModel = {
    getAll: async (entity, resolveReferences = true) => {
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
                const item = { id: `${entity}/${key}`, ...data[key] };
                convertIsoStringsToDates(item); // Convertir cadenas ISO a objetos Date
                if (resolveReferences) {
                    await ResolveReferences(item);
                }
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

    getById: async (id, resolveReferences = true) => {
        console.log("[Audit][FirebaseModel] Fetching data for entity with id:", id);
        const entityRef = ref(db, id);

        try {
            const snapshot = await get(entityRef);
            if (!snapshot.exists()) {
                throw new Error(`No data found for id: ${id}`);
            }
            const result = { id, ...snapshot.val() };
            convertIsoStringsToDates(result); // Convertir cadenas ISO a objetos Date
            if (resolveReferences) {
                await ResolveReferences(result);
            }
            console.log("[Audit][FirebaseModel] Fetched data for entity with id:", id, result);
            return result;
        } catch (error) {
            console.error("[Audit][FirebaseModel] Error fetching data for entity with id:", id, error);
            throw error;
        }
    },

    saveOrUpdate: async (entity, id, data) => {
        console.log("[Audit][FirebaseModel] Saving or updating entity:", entity, "with id:", id, "data:", data);

        let processedData = { ...data };

        const errors = ValidationModel.validateEntityData(processedData, entity);
        if (Object.keys(errors).length > 0) {
            console.error("[Audit][FirebaseModel] Validation errors:", errors);
            throw new Error(`Validation errors: ${JSON.stringify(errors)}`);
        }

        for (const key in processedData) {
            if (processedData[key] instanceof Date) {
                processedData[key] = processedData[key].toISOString();
            }
            if (processedData[key] === undefined) {
                delete processedData[key];
            }
        }

        const entityRef = id ? ref(db, id) : ref(db, entity);
        try {
            if (id) {
                await set(entityRef, processedData);
                console.log("[Audit][FirebaseModel] Updated entity:", entity, "with id:", id, processedData);
                return FirebaseModel.getById(id, true);
            } else {
                const newRef = await push(entityRef, processedData);
                console.log("[Audit][FirebaseModel] Created new entity:", entity, "with new id:", newRef.key);
                return FirebaseModel.getById(`${entity}/${newRef.key}`, true);
            }
        } catch (error) {
            console.error("[Audit][FirebaseModel] Error saving entity:", entity, "with id:", id, error);
            throw error;
        }
    },

    delete: async (id) => {
        console.log("[Audit][FirebaseModel] Deleting entity with id:", id);
        const entityRef = ref(db, id);
        try {
            await remove(entityRef);
            console.log("[Audit][FirebaseModel] Deleted entity with id:", id);
            return { id };
        } catch (error) {
            console.error("[Audit][FirebaseModel] Error deleting entity with id:", id, error);
            throw error;
        }
    }
};

export default FirebaseModel;
