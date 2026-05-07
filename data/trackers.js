// Imports
import { db } from "../firebase.js"
import {
    collection,     // references an entire collection (e.g. all Trackers)
    doc,            // references a specific document (e.g. timer1)
    setDoc,         // creates or overwrites a document
    increment,      // atomically increments a numeric field
    onSnapshot      // listens for real time changes in the database
} from "firebase/firestore"

// Database reference
const trackersRef = collection(db, "Trackers")

// --- Timers ---

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