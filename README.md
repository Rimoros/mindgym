# MindGym

A small, browser-based practice app for **memory, attention, and logic**. Built with plain HTML, CSS, and JavaScript. No build step, dependencies, account, API key, or paid hosting required.

This project expands an earlier MindGym prototype. The redesign restores its difficulty and points system, replaces the exercise controller, and adds a practice journal. It is an educational game, **not an IQ test or medical assessment**. No scientific claims about cognitive transfer are made.

## Run it

Open `dist/index.html` directly, or serve the repository folder:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/dist/`. A static server is recommended for consistent browser storage behavior. The app works without external network services after loading its local files. It is not an installable PWA and does not include a service worker.

## Publish for free on GitHub Pages

1. Create a GitHub repository, or use the existing MindGym repository.
2. Copy **the contents of `dist/`** to the root of the publishing branch. Keep `index.html`, `styles.css`, `core.js`, `app.js`, and `favicon.svg` together. Do not upload only the ZIP.
3. Commit and push those files.
4. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the branch containing those files and the **`/ (root)`** folder, then save.
6. Wait for GitHub's deployment to complete and open the URL shown in Pages settings.

All assets and links use relative paths, so project URLs such as `username.github.io/mindgym/` are supported. No domain purchase is required. You can also host the `dist/` directory with any static-file host. GitHub Pages availability depends on the repository's visibility and account plan; a public repository is the straightforward free option.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

**Important:** browser progress is tied to the origin. Your localhost results will not automatically appear on the published URL, another device, or another browser. No demo statistics ship with the project.

## Features

- Three skills, nine exercises, three difficulty levels.
- Five-question practice sessions; choose a particular exercise or a random mix within one skill.
- Correct: **Easy +2, Medium +4, Hard +6**. Incorrect: **−5**. Total points can be negative; they are not a skill percentage.
- Number recall: 4 / 6 / 8 digits, visible for 5 / 4 / 3 seconds. Leading zeroes matter.
- Pattern recall: 3 / 5 / 7 highlighted cells on 3×3 / 4×4 / 5×5 grids.
- Object locations: 3 / 5 / 7 shapes on progressively larger grids; recall one requested location.
- Odd one out: 4×4 / 6×6 / 8×8 symbol grids with increasingly similar symbols.
- Visual search: find all 3 / 5 / 8 targets among increasingly similar distractors.
- Color focus: identify ink color rather than the word; harder levels add surrounding distractor words.
- Number sequences: arithmetic, increasing differences, and alternating operations.
- Rule machine: additive, linear, and quadratic input–output rules.
- Deductions: choose the unique number satisfying parity, range, and, when necessary, remainder clues.
- Clear feedback and explanations; original grid answers revealed after submission.
- Invalid or empty entries do not change the score. A round can only be scored once.
- Results history with skill/type filters and pagination.
- Daily accuracy chart for the last seven days, per-skill lifetime accuracy, and an exact-values table. Missing days remain gaps, never invented zeroes.
- Current and best training streaks based on the device's local calendar. At least one completed answer counts as an active day.
- Four earned achievements, based on real attempt history.
- Persistent nine-question weekly assessment: one easy, medium, and hard question per skill, using all nine exercise types. Each skill receives a score out of three, alongside the total out of nine.
- Exactly 168 hours between completed weekly assessments. An unfinished assessment resumes, keeping its original questions, selections, and submitted answers.
- A refreshed page restarts an interrupted memory observation using the same question. Background observation time continues; stale timers cannot affect a new exercise.
- JSON export and a two-step reset control. Export is a readable archival copy; this version does not provide a JSON import interface.
- Responsive layouts, labeled controls, keyboard and arrow-key grid navigation, reduced-motion support, and browser-storage failure notices.

## Storage and earlier versions

New progress is stored in `localStorage` under `mindgym_product_v5`.

On a fresh installation, the app checks the known English prototype keys `mindgym_v4_english`, `mindgym_studio_v3`, and `mindgym_v2_local`. Valid answer records are imported as **Legacy** attempts. `focus` becomes `attention`. Since those records do not contain difficulty or awarded points, they receive **zero imported points**, while still contributing to activity and accuracy. The most recent old weekly completion retains its cooldown. Old keys are left untouched.

When only the original prototype's `mindgym_stats` data exists, those historical skill totals are preserved as a separate legacy summary. The app does **not** invent individual answers or assign an accuracy percentage to those totals.

Migration requires the same browser origin. Opening a downloaded file and then publishing on a different URL cannot transfer localStorage automatically. Clearing site data deletes local progress. The reset button clears the active version's progress; it does not delete browser settings or other sites' data.

There is no server and no tamper-proof enforcement: localStorage and the device clock are user-controlled. Seven-day lockouts and scores are suitable for a personal training app, not a secure competition. This is not a cloud-sync service. Use one active training tab; other tabs refresh their local session when shared progress changes.

## Architecture

```text
dist/
  index.html       Semantic shell and navigation
  styles.css       Design system, responsive layouts, motion preferences
  core.js          Pure generators, validation, scoring, dates, storage schema
  app.js           Rendering, routing, session state, persistence, interaction
  favicon.svg      Local vector mark
tests/
  core.test.cjs    Node assertions, generated exercise coverage
  browser.html    Real browser integration test runner
  browser.js      UI-driven assertions with real memory timers
  mobile.html     320 / 390 / 768 CSS-pixel viewport harness
UX_REVIEW.md       Original shortcomings and redesign decisions
TEST_REPORT.md     Executed checks, scope and limitations
```

A round moves through `ready → show → answer → result` for memory exercises and `answer → result` for the others. Timers carry cancellation tokens. A committed result is recorded before the next-question control appears. Form submissions and click actions share one validation path; dynamic rendering does not discard handlers because events are delegated.

Practice answers are durable, but the current five-question practice session is deliberately in memory. Reloading begins a new practice session without erasing history. Weekly attempts are durable and do not expose a restart/reroll control.

## Test it

Node 18 or later is sufficient for the pure logic tests:

```sh
node tests/core.test.cjs
```

For the real-browser integration suite, start the static server above and open:

```text
http://localhost:8000/tests/browser.html
```

Click **Run integration tests**. Keep that tab open until completion (roughly two minutes). The runner exercises actual production DOM controls and actual observation timers. It temporarily uses this origin's progress key and restores the previous snapshot in `finally`. Use a disposable local browser profile for QA; do not close the runner midway. No production test API or hidden demo-data mode is included.

For narrow-screen checks open `http://localhost:8000/tests/mobile.html`. This harness uses real 320, 390, and 768 CSS-pixel iframe layout viewports. It does not emulate a device's operating system, touch hardware, or Safari engine. Also test the published URL on your own phone before sharing it widely.

See `TEST_REPORT.md` for what was actually executed. Browser-only problems should be checked in the browser console rather than inferred from Node tests.

## Honest portfolio presentation

Describe this as an HTML/CSS/JavaScript web app with browser-local persistence and automated testing. Avoid calling it a React app, backend platform, scientific cognitive assessment, or a product with real users unless those claims become true. Be ready to explain generation rules, validation, timer cancellation, the weekly state machine, localStorage tradeoffs, and the tests. Disclose AI assistance when an application or reviewer asks about it; do not claim that assisted implementation was written entirely without help.
