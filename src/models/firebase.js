import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCOKQBJthEjqji2GxPsjcEZtUu965wtc1c",
    authDomain: "nrd-firebase.firebaseapp.com",
    databaseURL: "https://nrd-firebase-default-rtdb.firebaseio.com",
    projectId: "nrd-firebase",
    messagingSenderId: "840023356475",
    appId: "1:840023356475:web:a7411b9b5808ac51d8581e"
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const db = getDatabase(firebase);

export { firebase, auth, db };
