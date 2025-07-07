import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyBiBzU4kX2-aLKyo8V0YitKudZb40zULic",
    authDomain: "traffic-management-1ce0f.firebaseapp.com",
    databaseURL: "https://traffic-management-1ce0f-default-rtdb.firebaseio.com",
    projectId: "traffic-management-1ce0f",
    storageBucket: "traffic-management-1ce0f.firebasestorage.app",
    messagingSenderId: "151275367409",
    appId: "1:151275367409:web:286b283c5f715e5ff47250",
    measurementId: "G-9CLDXTTL5N"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database, ref, set, get, child };