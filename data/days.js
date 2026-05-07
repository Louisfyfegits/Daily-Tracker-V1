// Imports
import { db } from "../firebase.js"
import { 
    collection,     // references an entire collection (e.g. all Days)
    doc,            // references a specific document (e.g. one Day)
    setDoc,         // creates or overwrites a document
    updateDoc,      // updates specific fields in a document without overwriting
    deleteDoc,      // deletes an entire document
    onSnapshot,     // listens for real time changes in the database
    deleteField,    // removes a specific field from a document
    increment       // increments a numeric field by a specified amount
} from "firebase/firestore"

// Database references
const daysRef = collection(db, "Days")
const largeTasksRef = collection(db, "LargeTasks")

// Returns today's date as a string e.g. "01-05-2026"
export function getToday() {
    return new Date().toLocaleDateString("en-NZ").replaceAll("/", "-")
}

// --- Daily Tasks ---

// Adds a task to a specific day
export async function addTask(date, task) {
    const dayRef = doc(db, "Days", date)
    await setDoc(dayRef, {
        tasks: { [Date.now()]: { text: task, done: false } }
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

// --- Large Tasks ---

// Adds a large task
export async function addLargeTask(task) {
    await setDoc(doc(largeTasksRef, Date.now().toString()), {
        task: task
    })
}

// Removes a large task
export async function removeLargeTask(taskId) {
    await deleteDoc(doc(db, "LargeTasks", taskId))
}

// Listens for changes to large tasks
export function listenForLargeTasks(callback) {
    onSnapshot(largeTasksRef, (snapshot) => {
        const largeTasks = {}
        snapshot.forEach(doc => {
            largeTasks[doc.id] = doc.data().task
        })
        callback(largeTasks)
    })
}

// Updates a daily counter on a specific day (pass negative amount to decrement)
export async function updateDailyCounter(date, field, amount) {
    const dayRef = doc(db, "Days", date)
    await setDoc(dayRef, {
        [field]: increment(amount)
    }, { merge: true })
}