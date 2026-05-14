// Imports
import { db } from "../firebase.js"
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot
} from "firebase/firestore"

// Database references
const largeTasksRef = collection(db, "LargeTasks")
const guitarRef = collection(db, "Guitar")

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

// --- Guitar Skills ---

// Adds a guitar skill
export async function addGuitarSkill(skill) {
    await setDoc(doc(guitarRef, Date.now().toString()), {
        text: skill,
        learned: false
    })
}

// Removes a guitar skill
export async function removeGuitarSkill(skillId) {
    await deleteDoc(doc(db, "Guitar", skillId))
}

// Toggles a guitar skill as learned
export async function toggleGuitarSkill(skillId, currentLearned) {
    await updateDoc(doc(db, "Guitar", skillId), {
        learned: !currentLearned
    })
}

// Listens for changes to guitar skills
export function listenForGuitarSkills(callback) {
    onSnapshot(guitarRef, (snapshot) => {
        const skills = {}
        snapshot.forEach(doc => {
            skills[doc.id] = doc.data()
        })
        callback(skills)
    })
}