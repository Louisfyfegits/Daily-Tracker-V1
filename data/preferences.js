//Preferences are local

//DARKMODE
// Save the toggle state
export function saveToggle(key, value) {
    localStorage.setItem(key, value)
}

// Load the toggle state (applies saved boolean to the given toggle element)
export function loadToggle(element, saved) {
    element.checked = saved
    if (saved) {
        document.documentElement.classList.add('dark')
    }
}