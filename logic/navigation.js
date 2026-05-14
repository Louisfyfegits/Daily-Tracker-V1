// Imports
import { days, currentDate, setCurrentDate } from "./state.js"
import { renderDate, renderTasks } from "../ui/render.js"

// --- Element References ---
const dailyKmDisplay = document.getElementById("daily-km-display")
const dailyPushupsDisplay = document.getElementById("daily-pushups-display")

// Updates the daily counter displays for a given date
export function updateDailyCounterDisplay(date) {
    const d = days[date]
    dailyKmDisplay.textContent = d?.km ?? 0
    dailyPushupsDisplay.textContent = d?.pushups ?? 0
}

// Navigates forward or backward by a number of days (positive or negative)
export function navigateDay(direction) {
    const [day, month, year] = currentDate.split("-")
    const date = new Date(year, month - 1, day)
    date.setDate(date.getDate() + direction)
    const newDate = date.toLocaleDateString("en-NZ").replaceAll("/", "-")
    setCurrentDate(newDate)
    renderDate(newDate)
    renderTasks(days, newDate)
    updateDailyCounterDisplay(newDate)
}