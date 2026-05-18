// Imports
import { currentDate, currentTab, setCurrentTab, getCurrentDate, getCurrentTab } from "./state.js"
import { navigateDay } from "./navigation.js"
import { addTask, removeTask, toggleTask, updateDailyCounter } from "../data/days.js"
import { addLargeTask, removeLargeTask, addGuitarSkill, removeGuitarSkill, 
         toggleGuitarSkill, addSkatingSkill, removeSkatingSkill, toggleSkatingSkill
        , addAssignment, removeAssignment } from "../data/tasks.js"
import { resetTimer, updateCounter } from "../data/trackers.js"
import { renderGuitarSkills, renderSkatingSkills,renderAssignments } from "../ui/render.js"


// --- Daily Task Element References ---
const addButton = document.getElementById("add-btn")
const taskInput = document.getElementById("input-el")
const taskList = document.getElementById("ul-el")
const prevButton = document.getElementById("prev-btn")
const nextButton = document.getElementById("next-btn")

// --- Large Task Element References ---
const largeAddButton = document.getElementById("large-add-btn")
const largeTaskInput = document.getElementById("large-input-el")
const largeTaskList = document.getElementById("large-ul-el")

// --- Timer Element References ---
const timer1ResetBtn = document.getElementById("timer1-reset")
const timer2ResetBtn = document.getElementById("timer2-reset")

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

// --- Guitar Element References ---
const guitarInput = document.getElementById("guitar-input-el")
const guitarAddBtn = document.getElementById("guitar-add-btn")
const guitarList = document.getElementById("guitar-ul-el")
const guitarSessionBtn = document.getElementById("guitar-session-btn")

// --- Skating Element References ---
const skatingInput = document.getElementById("skating-input-el")
const skatingAddBtn = document.getElementById("skating-add-btn")
const skatingList = document.getElementById("skating-ul-el")
const skatingSessionBtn = document.getElementById("skating-session-btn")

// --- Work Element References ---
const studyInput = document.getElementById("study-input-el")
const studyAddBtn = document.getElementById("study-add-btn")
const assignmentsInput = document.getElementById("assignments-input-el")
const assignmentsAddBtn = document.getElementById("assignments-add-btn")
const assignmentsList = document.getElementById("assignments-ul-el")

// --- Daily Task Event Listeners ---
addButton.addEventListener("click", saveTask)
prevButton.addEventListener("click", () => navigateDay(-1))
nextButton.addEventListener("click", () => navigateDay(1))
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveTask()
})

// --- Large Task Event Listeners ---
largeAddButton.addEventListener("click", saveLargeTask)
largeTaskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveLargeTask()
})

// --- Timer Event Listeners ---
timer1ResetBtn.addEventListener("click", () => resetTimer("timer1"))
timer2ResetBtn.addEventListener("click", () => resetTimer("timer2"))

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
studyAddBtn.addEventListener("click", saveStudyTask)
studyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveStudyTask()
})

assignmentsAddBtn.addEventListener("click", saveAssignment)
assignmentsInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveAssignment()
})

assignmentsList.addEventListener("click", (e) => {
    const li = e.target.closest("li")
    if (!li) return
    if (e.target.classList.contains("delete-task")) removeAssignment(li.dataset.taskId)
})

// --- Guitar Event Listeners ---

guitarAddBtn.addEventListener("click", saveGuitarSkill)
guitarInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveGuitarSkill()
})

guitarSessionBtn.addEventListener("click", () => {
    addTask(getCurrentDate(), "Guitar practice", "hobbies")
})


guitarList.addEventListener("click", (e) => {
    const li = e.target.closest("li")
    if (!li) return
    const skillId = li.dataset.skillId
    const learned = li.dataset.learned === "true"

    if (e.target.classList.contains("checkbox")) {
        toggleGuitarSkill(skillId, learned)
    } else if (e.target.classList.contains("delete-skill")) {
        removeGuitarSkill(skillId)
    }
})

// --- Skating Event Listeners ---
skatingAddBtn.addEventListener("click", saveSkatingSkill)
skatingInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveSkatingSkill()
})
skatingSessionBtn.addEventListener("click", () => {
    addTask(currentDate, "Skate", "hobbies")
})
skatingList.addEventListener("click", (e) => {
    const li = e.target.closest("li")
    if (!li) return
    const skillId = li.dataset.skillId
    const learned = li.dataset.learned === "true"
    if (e.target.classList.contains("checkbox")) {
        toggleSkatingSkill(skillId, learned)
    } else if (e.target.classList.contains("delete-skill")) {
        removeSkatingSkill(skillId)
    }
})

// --- Swipe Event Listeners ---
let touchStartX = null

document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX
})

document.addEventListener("touchend", (e) => {
    if (touchStartX === null) return
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) < 35) return
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

// Saves a new daily task to the current day after cleaning the input
async function saveTask() {
    const task = taskInput.value.trim()
    if (task === "") return
    await addTask(currentDate, task, currentTab)
    taskInput.value = ""
}

// Saves a new large task after cleaning it 
async function saveLargeTask() {
    const task = largeTaskInput.value.trim()
    if (task === "") return
    await addLargeTask(task)
    largeTaskInput.value = ""
}

// Saves a new guitar skill after cleaning
async function saveGuitarSkill() {
    const skill = guitarInput.value.trim()
    if (skill === "") return
    await addGuitarSkill(skill)
    guitarInput.value = ""
}

// Saves a new skating skill
async function saveSkatingSkill() {
    const skill = skatingInput.value.trim()
    if (skill === "") return
    await addSkatingSkill(skill)
    skatingInput.value = ""
}

async function saveStudyTask() {
    const task = studyInput.value.trim()
    if (task === "") return
    await addTask(getCurrentDate(), task, "work")
    studyInput.value = ""
}

async function saveAssignment() {
    const task = assignmentsInput.value.trim()
    if (task === "") return
    await addAssignment(task)
    assignmentsInput.value = ""
}