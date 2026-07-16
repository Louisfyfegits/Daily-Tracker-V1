// Imports
import { setDays, setTimerInterval, getTimerInterval, clearTimerInterval, currentDate } from "./logic/state.js"
import { renderDate, renderTasks, renderLargeTasks, renderGuitarSkills, renderSkatingSkills, renderWarhammerSkills, renderAssignments, renderHabits, renderTimers } from "./ui/render.js"
import { listenForDays } from "./data/days.js"
import { listenForLargeTasks, listenForGuitarSkills, listenForSkatingSkills, listenForWarhammerSkills, listenForAssignments, listenForHabits, getWeekMonday } from "./data/tasks.js"
import { addTimer, listenForTimerDefs, listenForTimer, listenForCounter } from "./data/trackers.js"
import { startTimerInterval } from "./logic/utils.js"
import { updateDailyCounterDisplay, onNavigate } from "./logic/navigation.js"
import {loadToggle, saveToggle} from "./data/preferences"
import "./logic/events.js"

// for the second version document element ids can be chained, dont split them up made it hard for coding

// --- Counter Element References ---
const kmDisplay = document.getElementById("km-display")
const pushupsDisplay = document.getElementById("pushups-display")

const loadingOverlay = document.getElementById("loading-overlay")

//--local listeners, elements and references
//darkmode
const darkModeToggle = document.getElementById('dark-mode-toggle')

darkModeToggle.addEventListener('change', function() {
    saveToggle('darkMode', this.checked)
    if (this.checked) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
})

//--Local storage saves to load
const savedDarkMode = localStorage.getItem('darkMode') === 'true'
loadToggle(darkModeToggle, savedDarkMode)


// --- Firestore Listeners ---

// Listens for day changes and updates the UI

listenForDays((updatedDays) => {
    setDays(updatedDays)
    renderDate(currentDate)
    renderTasks(updatedDays, currentDate)
    updateDailyCounterDisplay(currentDate)
    loadingOverlay.classList.add("hidden")
})



// Listens for large task changes and updates the UI
listenForLargeTasks((updatedLargeTasks) => {
    renderLargeTasks(updatedLargeTasks)
})

// --- Timers ---
// Tracks one Firestore unsubscribe function per active timer id, so timers
// can be added/removed at runtime without hardcoding how many exist.
const timerUnsubs = new Map()

function subscribeTimer(timerId) {
    if (timerUnsubs.has(timerId)) return // already subscribed
    const unsub = listenForTimer(timerId, (startTimestamp) => {
        const display = document.getElementById(`timer-display-${timerId}`)
        if (!display) return // def exists but its row hasn't rendered yet
        const interval = startTimerInterval(display, startTimestamp, getTimerInterval(timerId))
        setTimerInterval(timerId, interval)
    })
    timerUnsubs.set(timerId, unsub)
}

function unsubscribeTimer(timerId) {
    const unsub = timerUnsubs.get(timerId)
    if (unsub) unsub()
    timerUnsubs.delete(timerId)
    clearTimerInterval(timerId)
}

// Listens for the set of timer definitions, renders their rows, and keeps
// each timer's countup subscription in sync with what currently exists.
// If there are no timers at all, seeds one default so the section is never empty.
let hasSeededDefaultTimer = false
listenForTimerDefs((timerDefs) => {
    renderTimers(timerDefs)

    // Subscribe to any new timers
    for (const timerId of Object.keys(timerDefs)) {
        subscribeTimer(timerId)
    }
    // Unsubscribe from any timers that were deleted
    for (const timerId of timerUnsubs.keys()) {
        if (!(timerId in timerDefs)) unsubscribeTimer(timerId)
    }

    // Seed a default timer the first time we see an empty list
    if (Object.keys(timerDefs).length === 0 && !hasSeededDefaultTimer) {
        hasSeededDefaultTimer = true
        addTimer("Timer")
    }
})

// Listens for kilometer changes and updates the UI
listenForCounter("kilometers", (value) => {
    kmDisplay.textContent = `${value} km`
})

// Listens for pushup changes and updates the UI
listenForCounter("pushups", (value) => {
    pushupsDisplay.textContent = value
})

// Listens for guitar skill changes and updates the UI
listenForGuitarSkills((updatedSkills) => {
    renderGuitarSkills(updatedSkills)
})

// Listens for skating skill changes and updates the UI
listenForSkatingSkills((updatedSkills) => {
    renderSkatingSkills(updatedSkills)
})

// Listens for warhammer skill changes and updates the UI
listenForWarhammerSkills((updatedSkills) => {
    renderWarhammerSkills(updatedSkills)
})

listenForAssignments((updated) => { renderAssignments(updated) })


// --- Habits ---
// Track the current habits listener so we can unsubscribe when the date changes
let currentHabitsUnsub = null
let currentHabitsWeek = null

// Subscribes to the correct week's habit document and renders it for the given date
function subscribeHabits(date) {
    const weekMonday = getWeekMonday(date)
    if (currentHabitsUnsub) currentHabitsUnsub()
    currentHabitsWeek = weekMonday
    currentHabitsUnsub = listenForHabits(weekMonday, (data) => {
        renderHabits(data, date, weekMonday)
    })
}

// Wire up initial habits listener for today's week
subscribeHabits(currentDate)

// Re-subscribe whenever the user navigates to a new date (handles week changes + highlight updates)
onNavigate((newDate) => subscribeHabits(newDate))