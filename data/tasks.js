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
const assignmentsRef = collection(db, "Assignments")

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

// --- Hobby Skills (Guitar, Skating, Warhammer, Skiing, etc.) ---

// Adds a skill to a hobby collection
export async function addHobbySkill(collectionName, skill) {
    const ref = collection(db, collectionName)
    await setDoc(doc(ref, Date.now().toString()), { text: skill, learned: false })
}

// Removes a skill from a hobby collection
export async function removeHobbySkill(collectionName, skillId) {
    await deleteDoc(doc(db, collectionName, skillId))
}

// Toggles a skill's learned state in a hobby collection
export async function toggleHobbySkill(collectionName, skillId, currentLearned) {
    await updateDoc(doc(db, collectionName, skillId), { learned: !currentLearned })
}

// Listens for changes to a hobby collection
export function listenForHobbySkills(collectionName, callback) {
    onSnapshot(collection(db, collectionName), (snapshot) => {
        const skills = {}
        snapshot.forEach(doc => { skills[doc.id] = doc.data() })
        callback(skills)
    })
}

//------- WORK TAB

export async function addAssignment(task) {
    await setDoc(doc(assignmentsRef, Date.now().toString()), { task: task })
}

export async function removeAssignment(taskId) {
    await deleteDoc(doc(db, "Assignments", taskId))
}

export function listenForAssignments(callback) {
    onSnapshot(assignmentsRef, (snapshot) => {
        const assignments = {}
        snapshot.forEach(doc => { assignments[doc.id] = doc.data().task })
        callback(assignments)
    })
}