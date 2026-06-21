// Imports
import { currentDate, currentTab, setCurrentTab, getCurrentDate, getEditing, setEditing } from "./state.js"
import { navigateDay } from "./navigation.js"
import { addTask, removeTask, toggleTask, updateDailyCounter } from "../data/days.js"
import { addLargeTask, removeLargeTask,
         addGuitarSkill, removeGuitarSkill, toggleGuitarSkill,
         addSkatingSkill, removeSkatingSkill, toggleSkatingSkill,
         addWarhammerSkill, removeWarhammerSkill, toggleWarhammerSkill,
         addAssignment, removeAssignment, toggleHabit } from "../data/tasks.js"
import { addTimer, removeTimer, resetTimer, updateCounter } from "../data/trackers.js"


// --- Daily Task Element References ---
const addButton = document.getElementById("add-btn")
const taskInput = document.getElementById("input-el")
const taskList = document.getElementById("ul-el")
const prevButton = document.getElementById("prev-btn")
const nextButton = document.getElementById("next-btn")

// --- Gym Element References ---
const gymInput = document.getElementById("gym-input-el")
const gymAddBtn = document.getElementById("gym-add-btn")

// --- Large Task Element References ---
const largeAddButton = document.getElementById("large-add-btn")
const largeTaskInput = document.getElementById("large-input-el")
const largeTaskList = document.getElementById("large-ul-el")

// --- Timer Element References ---
const timersContainer = document.getElementById("timers-container")
const addTimerBtn = document.getElementById("add-timer-btn")
const addTimerOverlay = document.getElementById("add-timer-overlay")
const addTimerClose = document.getElementById("add-timer-close")
const addTimerConfirm = document.getElementById("add-timer-confirm")
const timerNameInput = document.getElementById("timer-name-input")
// --- Edit Timers Element References ---
const editTimersBtn = document.getElementById("edit-timers-btn")

// --- Counter Element References ---
const dailyKmMinus = document.getElementById("daily-km-minus")
const dailyKmPlus = document.getElementById("daily-km-plus")
const dailyPushupsMinus = document.getElementById("daily-pushups-minus")
const dailyPushupsPlus = document.getElementById("daily-pushups-plus")

// --- Settings Element References ---
const settingsBtn = document.getElementById("settings-btn")
const settingsOverlay = document.getElementById("settings-overlay")
const settingsClose = document.getElementById("settings-close")

// --- Tab Element References ---
const tabButtons = document.querySelectorAll(".tab-btn")
const tabPanes = document.querySelectorAll(".tab-pane")

// --- Work Element References ---
const studyInput = document.getElementById("study-input-el")
const studyAddBtn = document.getElementById("study-add-btn")
const assignmentsInput = document.getElementById("assignments-input-el")
const assignmentsAddBtn = document.getElementById("assignments-add-btn")
const assignmentsList = document.getElementById("assignments-ul-el")

// --- Daily Task Event Listeners ---
prevButton.addEventListener("click", () => navigateDay(-1))
nextButton.addEventListener("click", () => navigateDay(1))

// --- Timer Event Listeners ---
// Delegated so any number of timers (added/removed at runtime) work without rewiring.
timersContainer.addEventListener("click", (e) => {
    const row = e.target.closest(".timer")
    if (!row) return
    const timerId = row.dataset.timerId
    const action = e.target.dataset.timerAction
    if (action === "reset") {
        resetTimer(timerId)
    } else if (action === "delete") {
        removeTimer(timerId)
    }
})

// --- Add Timer Popup ---
addTimerBtn.addEventListener("click", () => {
    addTimerOverlay.classList.remove("hidden")
    timerNameInput.focus()
})
addTimerClose.addEventListener("click", () => addTimerOverlay.classList.add("hidden"))

async function saveNewTimer() {
    const name = timerNameInput.value.trim()
    if (name === "") return
    await addTimer(name)
    timerNameInput.value = ""
    addTimerOverlay.classList.add("hidden")
}
addTimerConfirm.addEventListener("click", saveNewTimer)
timerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveNewTimer()
})

// --- Edit Timers Toggle ---
editTimersBtn.addEventListener("click", () => {
    const editing = !getEditing()
    setEditing(editing)
    timersContainer.classList.toggle("editing", editing)
})

// --- Counter Event Listeners ---
dailyKmPlus.addEventListener("click", () => {
    updateCounter("kilometers", 1)
    updateDailyCounter(currentDate, "km", 1)
})
dailyKmMinus.addEventListener("click", () => {
    updateCounter("kilometers", -1)
    updateDailyCounter(currentDate, "km", -1)
})
dailyPushupsPlus.addEventListener("click", () => {
    updateCounter("pushups", 10)
    updateDailyCounter(currentDate, "pushups", 10)
})
dailyPushupsMinus.addEventListener("click", () => {
    updateCounter("pushups", -10)
    updateDailyCounter(currentDate, "pushups", -10)
})

// --- Settings Event Listeners ---
settingsBtn.addEventListener("click", () => settingsOverlay.classList.remove("hidden"))
settingsClose.addEventListener("click", () => settingsOverlay.classList.add("hidden"))

// --- Tab Event Listeners ---
tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const tab = btn.dataset.tab
        setCurrentTab(tab)
        tabButtons.forEach(b => b.classList.remove("active"))
        btn.classList.add("active")
        tabPanes.forEach(pane => {
            pane.style.display = pane.dataset.tab === tab ? "block" : "none"
        })
    })
})

// --- Work Event Listeners ---
assignmentsList.addEventListener("click", (e) => {
    const li = e.target.closest("li")
    if (!li) return
    if (e.target.classList.contains("delete-task")) removeAssignment(li.dataset.taskId)
})

// --- Habits Event Delegation ---
const habitsTable = document.getElementById("habits-table")
habitsTable.addEventListener("click", (e) => {
    const cell = e.target.closest("td.habit-cell")
    if (!cell || cell.dataset.readonly === "true") return
    const { habit, day, week, checked } = cell.dataset
    toggleHabit(week, habit, day, checked === "true")
})

// --- Skill Section Wiring (generic) ---
// Wires up an "input + add button + list" section backed by a skills API
// (add/remove/toggle 'learned' state). Used for Guitar, Skating, Warhammer.
function wireSkillSection({ inputId, addBtnId, listId, addFn, removeFn, toggleFn }) {
    const input = document.getElementById(inputId)
    const addBtn = document.getElementById(addBtnId)
    const list = document.getElementById(listId)

    async function save() {
        const skill = input.value.trim()
        if (skill === "") return
        await addFn(skill)
        input.value = ""
    }

    addBtn.addEventListener("click", save)
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") save()
    })

    list.addEventListener("click", (e) => {
        const li = e.target.closest("li")
        if (!li) return
        const skillId = li.dataset.skillId
        const learned = li.dataset.learned === "true"
        if (e.target.classList.contains("checkbox")) {
            toggleFn(skillId, learned)
        } else if (e.target.classList.contains("delete-skill")) {
            removeFn(skillId)
        }
    })
}

// --- Guitar ---
wireSkillSection({
    inputId: "guitar-input-el",
    addBtnId: "guitar-add-btn",
    listId: "guitar-ul-el",
    addFn: addGuitarSkill,
    removeFn: removeGuitarSkill,
    toggleFn: toggleGuitarSkill
})

// --- Skating ---
wireSkillSection({
    inputId: "skating-input-el",
    addBtnId: "skating-add-btn",
    listId: "skating-ul-el",
    addFn: addSkatingSkill,
    removeFn: removeSkatingSkill,
    toggleFn: toggleSkatingSkill
})

// --- Warhammer ---
wireSkillSection({
    inputId: "warhammer-input-el",
    addBtnId: "warhammer-add-btn",
    listId: "warhammer-ul-el",
    addFn: addWarhammerSkill,
    removeFn: removeWarhammerSkill,
    toggleFn: toggleWarhammerSkill
})

// --- Session Button Event Listener (delegated) ---
// Any button with class "session-btn" + a data-session-task attribute works automatically.
// To add a new one, just add the button in HTML — no JS changes needed.
// (Session buttons always log to the "hobbies" tab regardless of which section they're in.)
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("session-btn")) return
    addTask(getCurrentDate(), e.target.dataset.sessionTask, "hobbies")
})

// --- Swipe Event Listeners ---
let touchStartX = null

document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX
})

document.addEventListener("touchend", (e) => {
    if (touchStartX === null) return
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) < 100) return
    if (diff > 0) navigateDay(1)
    else navigateDay(-1)
    touchStartX = null
})

// --- Daily Task Event Delegation ---
taskList.addEventListener("click", (e) => {
    const li = e.target.closest("li")
    if (!li) return
    const taskId = li.dataset.taskId
    const date = li.dataset.date
    const done = li.dataset.done === "true"
    if (e.target.classList.contains("checkbox") || e.target.classList.contains("task-text")) {
        toggleTask(date, taskId, done)
    } else if (e.target.classList.contains("delete-task")) {
        removeTask(date, taskId)
    }
})

// --- Large Task Event Delegation ---
largeTaskList.addEventListener("click", (e) => {
    const li = e.target.closest("li")
    if (!li) return
    const taskId = li.dataset.taskId
    if (e.target.classList.contains("delete-task")) {
        removeLargeTask(taskId)
    }
})

// --- Helper Functions ---

// Wires an input + add button pair to a save callback: trims the input,
// bails on empty, calls saveFn(text), then clears the input.
// Covers both single-arg saves (addLargeTask(text)) and multi-arg saves
// (addTask(date, text, tab)) since saveFn can close over whatever it needs.
function wireTaskInput(input, addBtn, saveFn) {
    async function save() {
        const text = input.value.trim()
        if (text === "") return
        await saveFn(text)
        input.value = ""
    }
    addBtn.addEventListener("click", save)
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") save()
    })
}

wireTaskInput(taskInput, addButton, (text) => addTask(currentDate, text, currentTab))
wireTaskInput(studyInput, studyAddBtn, (text) => addTask(getCurrentDate(), text, "work"))
wireTaskInput(gymInput, gymAddBtn, (text) => addTask(getCurrentDate(), text, "gym"))
wireTaskInput(largeTaskInput, largeAddButton, addLargeTask)
wireTaskInput(assignmentsInput, assignmentsAddBtn, addAssignment)