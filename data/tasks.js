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
//home tab
const largeTasksRef = collection(db, "LargeTasks")
//need to be generilised in the re build
const guitarRef = collection(db, "Guitar")
const skatingRef = collection(db, "Skating")

//work tab
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

// --- Skating Skills ---

// Adds a skating skill
export async function addSkatingSkill(skill) {
    await setDoc(doc(skatingRef, Date.now().toString()), {
        text: skill,
        learned: false
    })
}

// Removes a skating skill
export async function removeSkatingSkill(skillId) {
    await deleteDoc(doc(db, "Skating", skillId))
}

// Toggles a skating skill as learned
export async function toggleSkatingSkill(skillId, currentLearned) {
    await updateDoc(doc(db, "Skating", skillId), {
        learned: !currentLearned
    })
}

// Listens for changes to skating skills
export function listenForSkatingSkills(callback) {
    onSnapshot(skatingRef, (snapshot) => {
        const skills = {}
        snapshot.forEach(doc => {
            skills[doc.id] = doc.data()
        })
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