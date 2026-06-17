// Imports
import { setDays, setTimer1Interval, setTimer2Interval, currentDate } from "./logic/state.js"
import { renderDate, renderTasks, renderLargeTasks, renderGuitarSkills, renderSkatingSkills, renderAssignments, renderHabits } from "./ui/render.js"
import { listenForDays } from "./data/days.js"
import { listenForLargeTasks, listenForGuitarSkills, listenForSkatingSkills, listenForAssignments, listenForHabits, getWeekMonday } from "./data/tasks.js"
import { listenForTimer, listenForCounter } from "./data/trackers.js"
import { startTimerInterval } from "./logic/utils.js"
import { updateDailyCounterDisplay, onNavigate } from "./logic/navigation.js"
import "./logic/events.js"





// --- Counter Element References ---
const kmDisplay = document.getElementById("km-display")
const pushupsDisplay = document.getElementById("pushups-display")
const timer1Display = document.getElementById("timer1-display")
const timer2Display = document.getElementById("timer2-display")

const loadingOverlay = document.getElementById("loading-overlay")

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

// Listens for timer1 changes and starts the display interval
listenForTimer("timer1", (startTimestamp) => {
    setTimer1Interval(startTimerInterval(timer1Display, startTimestamp, null))
})

// Listens for timer2 changes and starts the display interval
listenForTimer("timer2", (startTimestamp) => {
    setTimer2Interval(startTimerInterval(timer2Display, startTimestamp, null))
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