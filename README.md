# MindGym

**Short practice sessions for memory, attention, and logic.**

[Try the live app](https://rimoros.github.io/mindgym/) · [Architecture](docs/architecture.md) · [Testing](docs/testing.md) · [Development](docs/development.md)

MindGym is a student-built web application with nine exercise types, three difficulty levels, and a browser-local practice journal. It explores how generated challenges, clear feedback, and persistent progress can work together in a small application built with HTML, CSS, and JavaScript.

## Explore the app

1. Open **Practice** and choose a skill, exercise, and difficulty.
2. Complete a five-question session. Memory exercises include a timed observation phase; answers have no time limit.
3. Open **Progress** to see your answers, accuracy, points, and activity history.
4. Try **Weekly check-in**: nine saved challenges, with a new assessment available 168 hours after completion.

No account or API key is needed. Progress is stored in the current browser; it is not shared across devices.

## Features

| Area | Exercises or behavior |
| --- | --- |
| Memory | Number recall, pattern recall, object locations |
| Attention | Odd one out, visual search, color focus |
| Logic | Number sequences, input–output rules, deductions |
| Feedback | Answer validation, explanations, and original grid solutions |
| Progress | Filterable history, seven-day accuracy chart with an exact-values table, streaks, and achievements |
| Persistence | Local storage, resumable weekly attempts, JSON export, and confirmed reset |
| Interaction | Keyboard controls, arrow-key grid navigation, responsive layouts, and reduced-motion support |

Correct answers earn **+2 / +4 / +6** points on easy / medium / hard. Incorrect answers deduct **5** points. Empty or invalid answers do not change the score. Points and accuracy are separate measures.

## Run locally

Clone the repository and serve its root with Python 3:

```sh
git clone https://github.com/Rimoros/mindgym.git
cd mindgym
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000/). There is no dependency installation or compilation step for the application. A local server provides more consistent storage behavior than opening an HTML file directly.

## How it is built

- **`core.js`** generates exercises and implements answer validation, scoring, date calculations, and storage normalization. It has no DOM dependency and can also be loaded in Node.
- **`app.js`** owns rendering, hash-based navigation, practice sessions, persisted weekly attempts, timers, and browser storage.
- **`index.html` and `styles.css`** provide the semantic page shell, visual design, responsive layouts, and motion preferences.
- **`tests/`** contains pure-logic tests and interactive browser test harnesses.
- **`docs/`** explains architecture, design decisions, verification, and known limitations.
- **`dist/`** contains an identical static distribution of the five application files. Root files are the source of truth; `npm run build` refreshes the copies and `npm run check` detects drift.

The application uses no framework, external scripts, remote fonts, analytics, or backend service. The [architecture notes](docs/architecture.md) explain state transitions and engineering tradeoffs.

## Verify the project

With Node.js 22 or later, run:

```sh
npm test
npm run check
```

No `npm install` is required: these commands use Node's built-in modules. GitHub Actions runs the same logic, syntax, and distribution checks on pushes and pull requests. Browser integration checks are run separately through [`tests/browser.html`](tests/browser.html); see the [testing guide and verification record](docs/testing.md) for scope and results.

## Scope and limitations

MindGym is an educational game. Its scores describe performance on these exercises; they are not an IQ test, medical assessment, or evidence of improved general cognitive ability.

Results belong to the current browser and origin. Clearing site data removes local progress. JSON export provides a readable copy; importing that copy is not implemented. Scores and weekly cooldowns depend on editable local storage and the device clock. Use one active practice tab. The app is not an installable PWA and does not include a service worker.

## Project background

The project develops an earlier MindGym prototype. Its current design restores difficulty-based scoring, expands the exercise set, and adds a practice journal and resumable weekly check-ins. The [design notes](docs/design.md) explain these choices; earlier review documents remain in [`docs/archive/`](docs/archive/).

Development and review have included AI assistance. The implementation, documented tradeoffs, and reproducible checks are available here for inspection.

## License

[MIT](LICENSE) · Copyright © 2026 Rimoros.
