# Daily Planner — Chrome Extension

A personal daily planner Chrome extension built with vanilla JS and Firebase Firestore for real-time sync across devices.

---

## Project Structure

```
index.html          — App markup, all elements JS hooks into
styles.css          — All styling and CSS variables
index.js            — Entry point, wires up all Firestore listeners
firebase.js         — Firebase init and db export
manifest.json       — Chrome extension config (name, icon, popup)
icon.png            — Toolbar icon
package.json        — Dependencies and build scripts

logic/
  state.js          — Shared app state (currentDate, currentTab, days, timers)
  events.js         — All DOM event listeners
  navigation.js     — Date navigation and daily counter display
  utils.js          — Timer helpers (elapsed time calc, interval runner)

data/
  days.js           — Firestore logic for daily tasks and daily counters
  tasks.js          — Firestore logic for large tasks, guitar, skating, assignments
  trackers.js       — Firestore logic for timers and global counters

ui/
  render.js         — All DOM rendering functions

dist/
  bundle.js         — Bundled output from esbuild (do not edit manually)
```

---

## Getting Started

```
npm install         — Download dependencies (run once on a fresh clone)
npm run build       — Bundle everything into dist/bundle.js (run once)
npm run watch       — Auto-rebuild on file changes (use while developing)
```

To load the extension in Chrome:
1. Run `npm run build`
2. Go to `chrome://extensions`
3. Enable Developer Mode (top right)
4. Click "Load unpacked" and select the project folder

---

## Tabs & Features

**Home**
- Daily tasks — per-day, with tab colour coding, done/delete
- Large tasks — persistent task list not tied to a date
- Trackers — two resettable countup timers (e.g. free days, sugar free)

**Gym**
- Gym tasks — daily tasks tagged to the gym tab
- Trackers — total km run and pushups done, with per-day counters

**Work**
- Study tasks — daily tasks tagged to the work tab
- Assignments — persistent list of assignments

**Hobbies**
- Guitar — skill list with learned toggle, + Session button adds a daily task
- Skating — same as guitar
- Warhammer — task list

---

## Firebase & Firestore

All data is stored in Firestore and syncs in real time. Collections used:

| Collection   | What it stores                          |
|--------------|-----------------------------------------|
| Days         | Daily tasks and per-day km/pushup counts|
| LargeTasks   | Persistent large task list              |
| Guitar       | Guitar skills with learned state        |
| Skating      | Skating skills with learned state       |
| Assignments  | Assignment list                         |
| Trackers     | Timer start timestamps and global counters|

---

## Bundling

The browser can't load ES modules and Firebase imports directly, so esbuild bundles everything into `dist/bundle.js`. That's the only file `index.html` loads.

CSS does not need bundling — the browser loads `styles.css` directly, so CSS changes apply without rebuilding.

---

## Mobile (Netlify)

A mobile version is hosted on Netlify and shares the same Firebase backend, so data stays in sync. Unlike the extension, the mobile version doesn't update automatically — you need to manually re-upload changed files (including `dist/bundle.js`) to Netlify after each build.

---

## Notes

- `node_modules/` is not committed — regenerate with `npm install`
- `dist/bundle.js` is not committed — regenerate with `npm run build`
- `package-lock.json` is auto-generated, commit it as-is