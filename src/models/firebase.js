import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCOKQBJthEjqji2GxPsjcEZtUu965wtc1c",
    authDomain: "nrd-firebase.firebaseapp.com",
    databaseURL: "https://nrd-firebase-default-rtdb.firebaseio.com",
    projectId: "nrd-firebase",
    storageBucket: "nrd-firebase.appspot.com",
    messagingSenderId: "840023356475",
    appId: "1:840023356475:web:a7411b9b5808ac51d8581e"
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const db = getDatabase(firebase);

async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Inicio de sesión exitoso');
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
    }
}

// Ejecutar el login automáticamente
await login("nriodor@gmail.com", "NuevaR1oDor");


export { firebase, auth, db, login };
