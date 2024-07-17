import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCTwwaxPN2NeitdQDHzSmcVBLOOgUMtHXc",
    authDomain: "nrd-test-81f37.firebaseapp.com",
    projectId: "nrd-test-81f37",
    storageBucket: "nrd-test-81f37.appspot.com",
    messagingSenderId: "992178759876",
    appId: "1:992178759876:web:f5e686c6bd47a28ce84191"
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
await login("nriodor@gmail.com", "12345678");


export { firebase, auth, db };
