// Calculates elapsed time from a start timestamp and returns a display string
export function getElapsedString(startTimestamp) {
    const elapsed = Date.now() - startTimestamp
    const seconds = Math.floor((elapsed / 1000) % 60)
    const minutes = Math.floor((elapsed / 1000 / 60) % 60)
    const hours = Math.floor((elapsed / 1000 / 60 / 60) % 24)
    const days = Math.floor(elapsed / 1000 / 60 / 60 / 24)
    return `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`
}

// Starts a display interval for a timer that updates every second
export function startTimerInterval(display, startTimestamp, existingInterval) {
    if (existingInterval) clearInterval(existingInterval)
    return setInterval(() => {
        display.textContent = getElapsedString(startTimestamp)
    }, 1000)
} 