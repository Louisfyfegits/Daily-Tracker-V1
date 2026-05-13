// Imports
import { getToday, addTask, removeTask, toggleTask, listenForDays, addLargeTask, removeLargeTask, listenForLargeTasks, updateDailyCounter } from "./data/days.js"
import { renderDate, renderTasks, renderLargeTasks } from "./ui/render.js"
import { resetTimer, listenForTimer, updateCounter, listenForCounter } from "./data/trackers.js"
import { startTimerInterval } from "./utils.js"

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
const timer1Display = document.getElementById("timer1-display")
const timer2Display = document.getElementById("timer2-display")
const timer1ResetBtn = document.getElementById("timer1-reset")
const timer2ResetBtn = document.getElementById("timer2-reset")

// --- Counter Element References (read only totals) ---
const kmDisplay = document.getElementById("km-display")
const pushupsDisplay = document.getElementById("pushups-display")

// --- Settings Element References ---
const settingsBtn = document.getElementById("settings-btn")
const settingsOverlay = document.getElementById("settings-overlay")
const settingsClose = document.getElementById("settings-close")

// --- Daily Counter Element References ---
const dailyKmDisplay = document.getElementById("daily-km-display")
const dailyPushupsDisplay = document.getElementById("daily-pushups-display")
const dailyKmMinus = document.getElementById("daily-km-minus")
const dailyKmPlus = document.getElementById("daily-km-plus")
const dailyPushupsMinus = document.getElementById("daily-pushups-minus")
const dailyPushupsPlus = document.getElementById("daily-pushups-plus")

// --- Global Variables ---
let days = {}                   // all days data from Firestore
let currentDate = getToday()    // date currently being viewed
let timer1Interval = null       // interval for timer1
let timer2Interval = null       // interval for timer2

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

// --- Daily Counter Event Listeners ---
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

// --- Swipe Event Listeners ---
let touchStartX = null

document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX
})

document.addEventListener("touchend", (e) => {
    if (touchStartX === null) return
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) < 35) return         // ignore small swipes
    if (diff > 0) navigateDay(1)            // swiped left  → next day
    else navigateDay(-1)                    // swiped right → prev day
    touchStartX = null
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

// Updates the daily counter displays for a given date
function updateDailyCounterDisplay(date) {
    const d = days[date]
    dailyKmDisplay.textContent = d?.km ?? 0
    dailyPushupsDisplay.textContent = d?.pushups ?? 0
}

// Navigates forward or backward by a number of days (positive or negative)
function navigateDay(direction) {
    const [day, month, year] = currentDate.split("-")
    const date = new Date(year, month - 1, day)
    date.setDate(date.getDate() + direction)
    currentDate = date.toLocaleDateString("en-NZ").replaceAll("/", "-")
    renderDate(currentDate)
    renderTasks(days, currentDate)
    updateDailyCounterDisplay(currentDate)
}

// --- Daily Task Functions ---

// Saves a new daily task to the current day
async function saveTask() {
    const task = taskInput.value.trim()
    if (task === "") return
    await addTask(currentDate, task)
    taskInput.value = ""
}

// --- Large Task Functions ---

// Saves a new large task
async function saveLargeTask() {
    const task = largeTaskInput.value.trim()
    if (task === "") return
    await addLargeTask(task)
    largeTaskInput.value = ""
}

// --- Firestore Listeners ---

// Listens for day changes and updates the UI
listenForDays((updatedDays) => {
    days = updatedDays
    renderDate(currentDate)
    renderTasks(days, currentDate)
    updateDailyCounterDisplay(currentDate)
})

// Listens for large task changes and updates the UI
listenForLargeTasks((updatedLargeTasks) => {
    renderLargeTasks(updatedLargeTasks)
})

// Listens for timer1 changes and starts the display interval
listenForTimer("timer1", (startTimestamp) => {
    timer1Interval = startTimerInterval(timer1Display, startTimestamp, timer1Interval)
})

// Listens for timer2 changes and starts the display interval
listenForTimer("timer2", (startTimestamp) => {
    timer2Interval = startTimerInterval(timer2Display, startTimestamp, timer2Interval)
})

// Listens for kilometer changes and updates the UI
listenForCounter("kilometers", (value) => {
    kmDisplay.textContent = `${value} km`
})

// Listens for pushup changes and updates the UI
listenForCounter("pushups", (value) => {
    pushupsDisplay.textContent = value
})