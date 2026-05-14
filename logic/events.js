// Imports
import { currentDate, currentTab, setCurrentTab } from "./state.js"
import { navigateDay } from "./navigation.js"
import { addTask, removeTask, toggleTask, addLargeTask, removeLargeTask, updateDailyCounter } from "../data/days.js"
import { resetTimer, updateCounter } from "../data/trackers.js"

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
    await addTask(currentDate, task)
    taskInput.value = ""
}

// Saves a new large task after cleaning it 
async function saveLargeTask() {
    const task = largeTaskInput.value.trim()
    if (task === "") return
    await addLargeTask(task)
    largeTaskInput.value = ""
}