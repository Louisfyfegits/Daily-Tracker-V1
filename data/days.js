// Imports
import { db } from "../firebase.js"
import { 
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    deleteField,
    increment
} from "firebase/firestore"

// Database references
const daysRef = collection(db, "Days")

// Returns today's date as a string e.g. "01-05-2026"
export function getToday() {
    return new Date().toLocaleDateString("en-NZ").replaceAll("/", "-")
}

// --- Daily Tasks ---

// Adds a task to a specific day
export async function addTask(date, task, tab = "home") {
    const dayRef = doc(db, "Days", date)
    await setDoc(dayRef, {
        tasks: { [Date.now()]: { text: task, done: false, tab: tab } }
    }, { merge: true })
}

// Toggles a task's done state
export async function toggleTask(date, taskId, currentDone) {
    const dayRef = doc(db, "Days", date)
    await updateDoc(dayRef, {
        [`tasks.${taskId}.done`]: !currentDone
    })
}

// Removes a specific task from a day
export async function removeTask(date, taskId) {
    const dayRef = doc(db, "Days", date)
    await updateDoc(dayRef, {
        [`tasks.${taskId}`]: deleteField()
    })
}

// Removes an entire day
export async function removeDay(date) {
    await deleteDoc(doc(db, "Days", date))
}

// Listens for changes across all days
export function listenForDays(callback) {
    onSnapshot(daysRef, (snapshot) => {
        const days = {}
        snapshot.forEach(doc => {
            days[doc.id] = doc.data()
        })
        callback(days)
    })
}

// Updates a daily counter on a specific day (pass negative amount to decrement)
export async function updateDailyCounter(date, field, amount) {
    const dayRef = doc(db, "Days", date)
    await setDoc(dayRef, {
        [field]: increment(amount)
    }, { merge: true })
}