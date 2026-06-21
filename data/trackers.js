// Imports
import { db } from "../firebase.js"
import {
    collection,     // references an entire collection (e.g. all Trackers)
    doc,            // references a specific document (e.g. a single timer)
    setDoc,         // creates or overwrites a document
    deleteDoc,      // deletes a document
    increment,      // atomically increments a numeric field
    onSnapshot      // listens for real time changes in the database
} from "firebase/firestore"

// Database references
const trackersRef = collection(db, "Trackers")
const timerDefsRef = collection(db, "TimerDefs")

// --- Timer Definitions ---
// A "timer def" is just { label }. Its doc id is also the timerId used to key
// the matching Trackers doc (startTimestamp), so the two collections stay linked.

// Adds a new timer with the given label, returns the new timer's id.
// Also seeds its Trackers doc so it starts counting immediately.
export async function addTimer(label) {
    const timerId = Date.now().toString()
    await setDoc(doc(timerDefsRef, timerId), { label: label })
    await setDoc(doc(trackersRef, timerId), { startTimestamp: Date.now() })
    return timerId
}

// Removes a timer definition and its tracker data
export async function removeTimer(timerId) {
    await deleteDoc(doc(db, "TimerDefs", timerId))
    await deleteDoc(doc(db, "Trackers", timerId))
}

// Renames an existing timer
export async function renameTimer(timerId, label) {
    await setDoc(doc(db, "TimerDefs", timerId), { label: label }, { merge: true })
}

// Listens for changes to the set of timer definitions
export function listenForTimerDefs(callback) {
    onSnapshot(timerDefsRef, (snapshot) => {
        const defs = {}
        snapshot.forEach(doc => { defs[doc.id] = doc.data().label })
        callback(defs)
    })
}

// --- Timers (countup data) ---

// Resets a timer by saving the current timestamp
export async function resetTimer(timerId) {
    await setDoc(doc(trackersRef, timerId), {
        startTimestamp: Date.now()
    })
}

// Listens for changes to a specific timer
export function listenForTimer(timerId, callback) {
    onSnapshot(doc(trackersRef, timerId), (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data().startTimestamp)
        }
    })
}

// --- Counters ---

// Updates a counter by a given amount (pass negative amount to decrement)
export async function updateCounter(counterId, amount) {
    const counterRef = doc(trackersRef, counterId)
    await setDoc(counterRef, {
        value: increment(amount)
    }, { merge: true })
}

// Listens for changes to a specific counter
export function listenForCounter(counterId, callback) {
    onSnapshot(doc(trackersRef, counterId), (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data().value)
        } else {
            // Create the document if it doesn't exist yet
            setDoc(doc(trackersRef, counterId), { value: 0 })
            callback(0)
        }
    })
}