import { ref, set, get, push, remove } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';
import { db } from './firebase.js';
import Entities from '../config/Entities.js';

const validateData = (entity, data) => {
    const entitySchema = Entities[entity].properties;
    if (!entitySchema) {
        throw new Error(`Unknown entity: ${entity}`);
    }
    const validatedData = {};
    for (const key in entitySchema) {
        if (data.hasOwnProperty(key)) {
            if (entitySchema[key].type === "number") {
                validatedData[key] = Number(data[key]);
                if (isNaN(validatedData[key])) {
                    throw new Error(`Invalid value for property: ${key}. Expected number, got ${typeof data[key]}`);
                }
            } else if (entitySchema[key].type === "boolean") {
                validatedData[key] = data[key] === "true" || data[key] === true;
            } else if (entitySchema[key].type === "array") {
                if (Array.isArray(data[key])) {
                    validatedData[key] = data[key];
                } else {
                    throw new Error(`Invalid value for property: ${key}. Expected array, got ${typeof data[key]}`);
                }
            } else {
                validatedData[key] = data[key];
            }
        } else {
            validatedData[key] = entitySchema[key].default;
        }
        if (typeof validatedData[key] !== entitySchema[key].type && entitySchema[key].type !== "array") {
            throw new Error(`Invalid type for property: ${key}. Expected ${entitySchema[key].type}, got ${typeof validatedData[key]}`);
        }
    }
    return validatedData;
};

const FirebaseModel = {
    getAll: (entity) => {
        const entityRef = ref(db, entity);
        return get(entityRef).then(snapshot => {
            const data = snapshot.val();
            if (data) {
                return Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
            } else {
                return [];
            }
        });
    },

    getById: (entity, id) => {
        const entityRef = ref(db, `${entity}/${id}`);
        return get(entityRef).then(snapshot => ({
            id: snapshot.key,
            ...snapshot.val()
        }));
    },

    saveOrUpdate: (entity, id, data) => {
        const validatedData = validateData(entity, data);
        const entityRef = id ? ref(db, `${entity}/${id}`) : ref(db, entity);
        return id ? set(entityRef, validatedData) : push(entityRef, validatedData).then(ref => ({
            id: ref.key,
            ...validatedData
        }));
    },

    delete: (entity, id) => {
        const entityRef = ref(db, `${entity}/${id}`);
        return remove(entityRef).then(() => ({
            id
        }));
    }
};

export default FirebaseModel;
