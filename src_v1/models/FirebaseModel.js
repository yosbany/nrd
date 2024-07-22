import { ref, set, get, push, remove } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';
import { db } from './firebase.js';
import Entities from '../config/Entities.js';

const validateData = (entity, data) => {
    const entitySchema = Entities[entity].properties;
    if (!entitySchema) {
        console.error("[Audit] Unknown entity:", entity);
        throw new Error(`Unknown entity: ${entity}`);
    }
    const validatedData = {};
    for (const key in entitySchema) {
        if (data.hasOwnProperty(key)) {
            if (entitySchema[key].type === "number") {
                validatedData[key] = Number(data[key]);
                if (isNaN(validatedData[key])) {
                    console.error("[Audit] Invalid value for property:", key, ". Expected number, got", typeof data[key]);
                    throw new Error(`Invalid value for property: ${key}. Expected number, got ${typeof data[key]}`);
                }
            } else if (entitySchema[key].type === "boolean") {
                validatedData[key] = data[key] === "true" || data[key] === true;
            } else if (entitySchema[key].type === "array") {
                if (Array.isArray(data[key])) {
                    validatedData[key] = data[key];
                } else {
                    console.error("[Audit] Invalid value for property:", key, ". Expected array, got", typeof data[key]);
                    throw new Error(`Invalid value for property: ${key}. Expected array, got ${typeof data[key]}`);
                }
            } else if (entitySchema[key].type === "base64") {
                validatedData[key] = data[key];
            } else {
                validatedData[key] = data[key];
            }
        } else {
            validatedData[key] = entitySchema[key].default;
        }
        if (typeof validatedData[key] !== entitySchema[key].type && entitySchema[key].type !== "array" && entitySchema[key].type !== "base64") {
            console.error("[Audit] Invalid type for property:", key, ". Expected", entitySchema[key].type, ", got", typeof validatedData[key]);
            throw new Error(`Invalid type for property: ${key}. Expected ${entitySchema[key].type}, got ${typeof validatedData[key]}`);
        }
    }
    console.log("[Audit] Validated data for entity:", entity, validatedData);
    return validatedData;
};

const FirebaseModel = {
    getAll: (entity) => {
        console.log("[Audit] Fetching all data for entity:", entity);
        const entityRef = ref(db, entity);
        return get(entityRef).then(snapshot => {
            const data = snapshot.val();
            if (data) {
                const result = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                console.log("[Audit] Fetched data for entity:", entity, result);
                return result;
            } else {
                console.log("[Audit] No data found for entity:", entity);
                return [];
            }
        }).catch(error => {
            console.error("[Audit] Error fetching data for entity:", entity, error);
            throw error;
        });
    },

    getById: (entity, id) => {
        console.log("[Audit] Fetching data for entity:", entity, "with id:", id);
        const entityRef = ref(db, `${entity}/${id}`);
        return get(entityRef).then(snapshot => {
            const result = {
                id: snapshot.key,
                ...snapshot.val()
            };
            console.log("[Audit] Fetched data for entity:", entity, "with id:", id, result);
            return result;
        }).catch(error => {
            console.error("[Audit] Error fetching data for entity:", entity, "with id:", id, error);
            throw error;
        });
    },

    saveOrUpdate: (entity, id, data) => {
        console.log("[Audit] Saving or updating entity:", entity, "with id:", id, "data:", data);
        const validatedData = validateData(entity, data);
        const entityRef = id ? ref(db, `${entity}/${id}`) : ref(db, entity);
        return id ? set(entityRef, validatedData).then(() => {
            console.log("[Audit] Updated entity:", entity, "with id:", id, validatedData);
            return { id, ...validatedData };
        }).catch(error => {
            console.error("[Audit] Error updating entity:", entity, "with id:", id, error);
            throw error;
        }) : push(entityRef, validatedData).then(ref => {
            const result = { id: ref.key, ...validatedData };
            console.log("[Audit] Created new entity:", entity, result);
            return result;
        }).catch(error => {
            console.error("[Audit] Error creating entity:", entity, error);
            throw error;
        });
    },

    delete: (entity, id) => {
        console.log("[Audit] Deleting entity:", entity, "with id:", id);
        const entityRef = ref(db, `${entity}/${id}`);
        return remove(entityRef).then(() => {
            console.log("[Audit] Deleted entity:", entity, "with id:", id);
            return { id };
        }).catch(error => {
            console.error("[Audit] Error deleting entity:", entity, "with id:", id, error);
            throw error;
        });
    }
};

export default FirebaseModel;
