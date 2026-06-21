// Imports
import { getToday } from "../data/days.js"

// --- Shared State ---
export let days = {}
export let currentDate = getToday()
export let currentTab = "home"
// Tracks each running timer's display interval, keyed by timerId,
// so any number of timers can be started/cleared without named variables per timer.
export const timerIntervals = new Map()

// --- Setters ---
export function setDays(updated) { days = updated }
export function setCurrentDate(date) { currentDate = date }
export function setCurrentTab(tab) { currentTab = tab }
export function getCurrentDate() { return currentDate }
export function getCurrentTab() { return currentTab }

// Starts (or restarts) the display interval for a given timer id
export function setTimerInterval(timerId, interval) {
    timerIntervals.set(timerId, interval)
}

// Returns the currently running interval for a timer id, if any
export function getTimerInterval(timerId) {
    return timerIntervals.get(timerId)
}

// Stops and forgets a timer's interval (call when a timer is deleted)
export function clearTimerInterval(timerId) {
    const existing = timerIntervals.get(timerId)
    if (existing) clearInterval(existing)
    timerIntervals.delete(timerId)
}

//Editing mode on or off
export let isEditing = false
export function setEditing(value) { isEditing = value }
export function getEditing() { return isEditing }