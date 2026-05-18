// Imports
import { getToday } from "../data/days.js"

// --- Shared State ---
export let days = {}
export let currentDate = getToday()
export let currentTab = "home"
export let timer1Interval = null
export let timer2Interval = null

// --- Setters ---
export function setDays(updated) { days = updated }
export function setCurrentDate(date) { currentDate = date }
export function setCurrentTab(tab) { currentTab = tab }
export function setTimer1Interval(interval) { timer1Interval = interval }
export function setTimer2Interval(interval) { timer2Interval = interval }
export function getCurrentDate() { return currentDate }
export function getCurrentTab() { return currentTab }