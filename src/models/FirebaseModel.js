import { ref, set, get, push, remove } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';
import { db } from './firebase.js';

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
        const entityRef = id ? ref(db, `${entity}/${id}`) : ref(db, entity);
        return id ? set(entityRef, data) : push(entityRef, data).then(ref => ({
            id: ref.key,
            ...data
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
