//imports
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAka1ye_fCZD7jdCaTecEaNYIezfmx2yxQ",
    authDomain: "todo-viewer-42c81.firebaseapp.com",
    projectId: "todo-viewer-42c81",
    storageBucket: "todo-viewer-42c81.firebasestorage.app",
    messagingSenderId: "212357281602",
    appId: "1:212357281602:web:95522140dc0b3b8b9f7adb"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)