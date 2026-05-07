//imports
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDi67wGRARhxRaJFZaTDzKGOygktdgGLCA",
    authDomain: "todo-acf04.firebaseapp.com",
    projectId: "todo-acf04",
    storageBucket: "todo-acf04.firebasestorage.app",
    messagingSenderId: "827749781012",
    appId: "1:827749781012:web:dcd3197c057e71eb03a101"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)