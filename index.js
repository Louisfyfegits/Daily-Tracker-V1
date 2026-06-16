// Imports
import { setDays, setTimer1Interval, setTimer2Interval, currentDate } from "./logic/state.js"
import { renderDate, renderTasks, renderLargeTasks, renderGuitarSkills, renderSkatingSkills, renderWarhammerSkills, renderSkiingSkills, renderAssignments } from "./ui/render.js"
import { listenForDays } from "./data/days.js"
import { listenForLargeTasks, listenForHobbySkills, listenForAssignments } from "./data/tasks.js"
import { listenForTimer, listenForCounter } from "./data/trackers.js"
import { startTimerInterval } from "./logic/utils.js"
import { updateDailyCounterDisplay } from "./logic/navigation.js"
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

listenForHobbySkills("Guitar", (skills) => { renderGuitarSkills(skills) })
listenForHobbySkills("Skating", (skills) => { renderSkatingSkills(skills) })
listenForHobbySkills("Warhammer", (skills) => { renderWarhammerSkills(skills) })
listenForHobbySkills("Skiing", (skills) => { renderSkiingSkills(skills) })

listenForAssignments((updated) => { renderAssignments(updated) })