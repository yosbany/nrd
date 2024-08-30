import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';

const config = {
    production: {
        apiKey: "AIzaSyDSvz3AIwr_VFN7LOkfeGBTVnDQnNaDUnE",
        authDomain: "nrd-prod-b7deb.firebaseapp.com",
        databaseURL: "https://nrd-prod-b7deb-default-rtdb.firebaseio.com",
        projectId: "nrd-prod-b7deb",
        storageBucket: "nrd-prod-b7deb.appspot.com",
        messagingSenderId: "916228267086",
        appId: "1:916228267086:web:8ad4b7d9ab56acd4d0771f"
    },
    testing: {
        apiKey: "AIzaSyCTwwaxPN2NeitdQDHzSmcVBLOOgUMtHXc",
        authDomain: "nrd-test-81f37.firebaseapp.com",
        databaseURL: "https://nrd-test-81f37-default-rtdb.firebaseio.com",
        projectId: "nrd-test-81f37",
        storageBucket: "nrd-test-81f37.appspot.com",
        messagingSenderId: "992178759876",
        appId: "1:992178759876:web:f5e686c6bd47a28ce84191"
    }
};

// Determinar el entorno basado en el nombre del host
const host = window.location.hostname;

let environment;

if (host.includes('yosbany.github.io')) {
    environment = 'production';
} else {
    environment = 'testing';
}

const FirebaseConfig = config[environment];

// Inicializar la aplicación Firebase
const FirebaseAppConfig = initializeApp(FirebaseConfig);

// Exportar la aplicación inicializada
export default FirebaseAppConfig;
