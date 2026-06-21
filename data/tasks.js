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

// --- Generic list factory (plain text lists: add / remove / listen) ---
// Used for any collection that's just a flat list of strings (LargeTasks, Assignments, etc).
function makeListApi(collectionName) {
    const ref = collection(db, collectionName)

    return {
        async add(task) {
            await setDoc(doc(ref, Date.now().toString()), { task: task })
        },
        async remove(taskId) {
            await deleteDoc(doc(db, collectionName, taskId))
        },
        listen(callback) {
            onSnapshot(ref, (snapshot) => {
                const items = {}
                snapshot.forEach(doc => { items[doc.id] = doc.data().task })
                callback(items)
            })
        }
    }
}

// --- Generic skills factory (text + learned toggle: add / remove / toggle / listen) ---
// Used for any collection shaped like { text, learned } (Guitar, Skating, Warhammer, etc).
function makeSkillsApi(collectionName) {
    const ref = collection(db, collectionName)

    return {
        async add(skill) {
            await setDoc(doc(ref, Date.now().toString()), {
                text: skill,
                learned: false
            })
        },
        async remove(skillId) {
            await deleteDoc(doc(db, collectionName, skillId))
        },
        async toggle(skillId, currentLearned) {
            await updateDoc(doc(db, collectionName, skillId), {
                learned: !currentLearned
            })
        },
        listen(callback) {
            onSnapshot(ref, (snapshot) => {
                const skills = {}
                snapshot.forEach(doc => { skills[doc.id] = doc.data() })
                callback(skills)
            })
        }
    }
}

// --- Large Tasks (home tab) ---
const largeTasksApi = makeListApi("LargeTasks")
export const addLargeTask = largeTasksApi.add
export const removeLargeTask = largeTasksApi.remove
export const listenForLargeTasks = largeTasksApi.listen

// --- Guitar Skills (hobbies tab) ---
const guitarApi = makeSkillsApi("Guitar")
export const addGuitarSkill = guitarApi.add
export const removeGuitarSkill = guitarApi.remove
export const toggleGuitarSkill = guitarApi.toggle
export const listenForGuitarSkills = guitarApi.listen

// --- Skating Skills (hobbies tab) ---
const skatingApi = makeSkillsApi("Skating")
export const addSkatingSkill = skatingApi.add
export const removeSkatingSkill = skatingApi.remove
export const toggleSkatingSkill = skatingApi.toggle
export const listenForSkatingSkills = skatingApi.listen

// --- Warhammer (hobbies tab) ---
const warhammerApi = makeSkillsApi("Warhammer")
export const addWarhammerSkill = warhammerApi.add
export const removeWarhammerSkill = warhammerApi.remove
export const toggleWarhammerSkill = warhammerApi.toggle
export const listenForWarhammerSkills = warhammerApi.listen

// --- Assignments (work tab) ---
const assignmentsApi = makeListApi("Assignments")
export const addAssignment = assignmentsApi.add
export const removeAssignment = assignmentsApi.remove
export const listenForAssignments = assignmentsApi.listen

// --- Habits ---

// Returns the Monday date string for any given date string "DD-MM-YYYY"
export function getWeekMonday(dateStr) {
    const [day, month, year] = dateStr.split("-")
    const d = new Date(year, month - 1, day)
    const dayOfWeek = d.getDay() // 0=Sun, 1=Mon...
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // roll back to Monday
    d.setDate(d.getDate() + diff)
    return d.toLocaleDateString("en-NZ").replaceAll("/", "-")
}

// Toggles a single habit cell (e.g. habit="gym", dayKey="Mon")
export async function toggleHabit(weekMonday, habit, dayKey, currentValue) {
    const habitDocRef = doc(db, "Habits", weekMonday)
    await setDoc(habitDocRef, {
        [habit]: { [dayKey]: !currentValue }
    }, { merge: true })
}

// Listens for a specific week's habit document
export function listenForHabits(weekMonday, callback) {
    return onSnapshot(doc(db, "Habits", weekMonday), (snapshot) => {
        callback(snapshot.exists() ? snapshot.data() : {})
    })
}