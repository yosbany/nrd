// Importar Firebase SDK y configuración
import { db } from './firebase.js'; // Asumiendo que './firebase' contiene la configuración de Firebase

// Objeto para manejar operaciones con Firebase
const FirebaseModel = {
    // Función para obtener todos los documentos de una colección
    getAll: (entity) => {
        return db.ref(entity).once('value').then(snapshot => snapshot.val());
    },

    // Función para obtener un documento específico por su ID
    getById: (entity, id) => {
        return db.ref(`${entity}/${id}`).once('value').then(snapshot => snapshot.val());
    },

    // Función para guardar o actualizar un documento
    saveOrUpdate: (entity, id, data) => {
        if (id) {
            // Actualizar si ya existe un ID
            return db.ref(`${entity}/${id}`).set(data);
        } else {
            // Guardar un nuevo documento sin ID (Firebase generará uno nuevo)
            return db.ref(entity).push(data);
        }
    },

    // Función para eliminar un documento por su ID
    delete: (entity, id) => {
        return db.ref(`${entity}/${id}`).remove();
    }
};

export default FirebaseModel;
