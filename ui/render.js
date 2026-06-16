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

// Renders the weekly habits table for the gym tab
// habitData = the Firestore document for that week e.g. { gym: { Mon: true }, run: { Wed: true } }
// currentDate = the date string currently being viewed "DD-MM-YYYY"
// weekMonday = the Monday key for this week e.g. "16-06-2025"
export function renderHabits(habitData, currentDate, weekMonday) {
    const table = document.getElementById("habits-table")
    if (!table) return

    const HABITS = ["Gym", "Finistride", "Creatine", "2L Water", "Run"]
    const HABIT_KEYS = ["gym", "finistride", "creatine", "water", "run"]
    const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    // Work out which column is "today" and which is the viewed day
    const today = new Date()
    const todayStr = today.toLocaleDateString("en-NZ").replaceAll("/", "-")

    // Get day-of-week index for the viewed date (0=Mon..6=Sun)
    const [d, m, y] = currentDate.split("-")
    const viewedDate = new Date(y, m - 1, d)
    const rawDay = viewedDate.getDay() // 0=Sun
    const viewedDayIndex = rawDay === 0 ? 6 : rawDay - 1 // convert to Mon=0

    // Get today's index too
    const rawToday = today.getDay()
    const todayIndex = rawToday === 0 ? 6 : rawToday - 1

    // Is this week in the past (read-only)?
    const [tm, mm, ym] = weekMonday.split("-")
    const mondayDate = new Date(ym, mm - 1, tm)
    const thisMondayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    // Roll back today to Monday
    const todayRaw = today.getDay()
    const rollback = todayRaw === 0 ? -6 : 1 - todayRaw
    thisMondayDate.setDate(thisMondayDate.getDate() + rollback)
    const isPastWeek = mondayDate < thisMondayDate

    // Build header row
    let headerHtml = `<thead><tr><th class="habit-label-col"></th>`
    DAY_KEYS.forEach((dk, i) => {
        const isToday = !isPastWeek && i === todayIndex
        headerHtml += `<th class="habit-day-col${isToday ? " habit-today" : ""}">${dk}</th>`
    })
    headerHtml += `</tr></thead>`

    // Build body rows
    let bodyHtml = `<tbody>`
    HABITS.forEach((label, hi) => {
        const key = HABIT_KEYS[hi]
        const habitRow = habitData[key] || {}
        bodyHtml += `<tr>`
        bodyHtml += `<td class="habit-label">${label}</td>`
        DAY_KEYS.forEach((dk, i) => {
            const checked = habitRow[dk] === true
            const isToday = !isPastWeek && i === todayIndex
            const isViewed = i === viewedDayIndex
            bodyHtml += `<td class="habit-cell${isToday ? " habit-today" : ""}${isViewed ? " habit-viewed" : ""}"
                data-habit="${key}" data-day="${dk}" data-week="${weekMonday}" data-checked="${checked}"
                ${isPastWeek ? "data-readonly='true'" : ""}>
                ${checked ? `<span class="habit-check">&#10003;</span>` : ""}
            </td>`
        })
        bodyHtml += `</tr>`
    })
    bodyHtml += `</tbody>`

    table.innerHTML = headerHtml + bodyHtml
}