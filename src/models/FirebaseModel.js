import { ref, set, get, push, remove } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';
import { db } from './firebase.js';

const FirebaseModel = {
    getAll: (entity) => {
        const entityRef = ref(db, entity);
        return get(entityRef).then(snapshot => snapshot.val());
    },

    getById: (entity, id) => {
        const entityRef = ref(db, `${entity}/${id}`);
        return get(entityRef).then(snapshot => snapshot.val());
    },

    saveOrUpdate: (entity, id, data) => {
        const entityRef = id ? ref(db, `${entity}/${id}`) : ref(db, entity);
        return id ? set(entityRef, data) : push(entityRef, data);
    },

    delete: (entity, id) => {
        const entityRef = ref(db, `${entity}/${id}`);
        return remove(entityRef);
    }
};

export default FirebaseModel;
