import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';

// Configuraciones para diferentes entornos
const firebaseConfigs = {
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

// Determinar la configuración de Firebase según el host
function getFirebaseConfig() {
    const hostname = window.location.hostname;
    if (hostname === 'yosbany.github.io') {
        return firebaseConfigs.production;
    } else {
        return firebaseConfigs.testing;
    }
}

// Inicializar Firebase con la configuración adecuada
const firebaseConfig = getFirebaseConfig();
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const db = getDatabase(firebase);

export { firebase, auth, db };
