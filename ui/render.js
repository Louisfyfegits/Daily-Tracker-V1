// Renders the date and day of week in the header
export function renderDate(date) {
    const dateDisplay = document.getElementById("date-display")
    const [day, month, year] = date.split("-")
    const dateObj = new Date(year, month - 1, day)
    const dayOfWeek = dateObj.toLocaleDateString("en-NZ", { weekday: "long" })
    const dateString = date.replaceAll("-", "/")

    const today = new Date() 
    const diff = Math.round((dateObj - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / (1000 * 60 * 60 * 24))

    let label = ""
    if (diff === 0) label = "Today"
    else if (diff === -1) label = "Yesterday"
    else if (diff === 1) label = "Tomorrow"

    dateDisplay.innerHTML = `
        <span class="date-label">${label || "&nbsp;"}</span>
        <span class="date-main">${dateString}</span>
        <span class="date-day">${dayOfWeek}</span>
    `
}

// Renders the list of daily tasks for the current day and there colors
export function renderTasks(days, currentDate) {
    const taskList = document.getElementById("ul-el")
    const day = days[currentDate]
    const tasks = day ? (day.tasks || {}) : {}

    let html = ""
    for (const [taskId, task] of Object.entries(tasks)) {
        html += `
        <li data-task-id="${taskId}" data-date="${currentDate}" data-done="${task.done}" data-tab="${task.tab || "home"}" class="${task.done ? "done" : ""}">
            <span class="checkbox">${task.done ? "&#10003;" : ""}</span>
            <span class="task-text">${task.text}</span>
            <span class="delete-task">&#10005;</span>
        </li>`
    }
    taskList.innerHTML = html
}

// Renders the list of large tasks
export function renderLargeTasks(largeTasks) {
    const largeTaskList = document.getElementById("large-ul-el")

    let html = ""
    for (const [taskId, task] of Object.entries(largeTasks)) {
        html += `
        <li data-task-id="${taskId}">
            <span class="task-text">${task}</span>
            <span class="delete-task">&#10005;</span>
        </li>`
    }
    largeTaskList.innerHTML = html
}

// Renders the list of guitar skills
export function renderGuitarSkills(skills) {
    const guitarList = document.getElementById("guitar-ul-el")

    let html = ""
    for (const [skillId, skill] of Object.entries(skills)) {
        html += `
        <li data-skill-id="${skillId}" data-learned="${skill.learned}" class="${skill.learned ? "learned" : ""}">
            <span class="checkbox">${skill.learned ? "&#10003;" : ""}</span>
            <span class="skill-text">${skill.text}</span>
            <span class="delete-skill">&#10005;</span>
        </li>`
    }
    guitarList.innerHTML = html
}

// Renders the list of skating skills
export function renderSkatingSkills(skills) {
    const skatingList = document.getElementById("skating-ul-el")

    let html = ""
    for (const [skillId, skill] of Object.entries(skills)) {
        html += `
        <li data-skill-id="${skillId}" data-learned="${skill.learned}" class="${skill.learned ? "learned" : ""}">
            <span class="checkbox">${skill.learned ? "&#10003;" : ""}</span>
            <span class="skill-text">${skill.text}</span>
            <span class="delete-skill">&#10005;</span>
        </li>`
    }
    skatingList.innerHTML = html
}

export function renderAssignments(assignments) {
    const list = document.getElementById("assignments-ul-el")
    let html = ""
    for (const [id, task] of Object.entries(assignments)) {
        html += `
        <li data-task-id="${id}">
            <span class="task-text">${task}</span>
            <span class="delete-task">&#10005;</span>
        </li>`
    }
    list.innerHTML = html
}