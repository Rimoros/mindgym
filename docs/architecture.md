# Architecture

MindGym is a static, single-page application. All application assets are local. Hash routes work under a GitHub Pages project path without a server-side router.

## Responsibilities

| File | Responsibility |
| --- | --- |
| `index.html` | Navigation, main landmark, live status region, and local asset loading |
| `styles.css` | Layout, typography, grids, focus states, route animation, and reduced-motion overrides |
| `core.js` | Exercise generation, validation, points, summaries, local date keys, streaks, and stored-data normalization |
| `app.js` | DOM rendering, delegated events, routes, sessions, timers, persistence, history, and export |

`core.js` exposes the same API as `window.MindGym` in a browser and through `module.exports` in Node. The UI controller is enclosed in a function rather than exposing controller methods as a public test API. Browser tests exercise its real DOM controls.

## Exercise lifecycle

Memory rounds use `ready → show → answer → result`. Other rounds use `answer → result`. A successful validation records one answer before enabling progression. Invalid submissions keep the round in the answer phase without changing points.

Observation timers have cancellation tokens. Switching exercises, difficulty, or routes cancels pending observation work so an old callback cannot modify a new round. Reloading an interrupted weekly memory observation returns that question to `ready` without generating a replacement.

Route changes use a cancellable exit transition followed by rendering and entrance animation. The navigation underline follows the active link's measured position and width. Exercise feedback renders immediately rather than waiting for a route animation. Reduced-motion preferences disable the decorative transitions.

## Sessions and persistence

A practice session contains five questions and lives in memory. Committed answers are saved individually. Reloading starts a fresh practice session while preserving history.

Weekly assessments contain nine questions: one easy, medium, and hard question for each skill, covering all nine exercise types. Questions, current index, selections, and submitted results are persisted. On completion, the app stores a summary, clears the active assessment, and starts a `604800000` millisecond cooldown.

The `mindgym_product_v5` local-storage entry contains:

| Field | Meaning |
| --- | --- |
| `version` | Storage schema version, currently 5 |
| `sessions` | Individual committed answers, including skill, level, result, points, timestamp, and source |
| `weekly` | Completed weekly assessments with nine per-question results |
| `activeWeekly` | Unfinished assessment, or `null` |
| `legacy` | Optional earlier-version summary or migration information |

Known prototype keys are checked only when current-version progress is absent. Valid older answer records are imported with a legacy label and zero imported points because their original difficulty is unknown. Old summary totals remain separate rather than being converted into invented answers. Migration requires the same browser origin.

Storage writes can fail; the UI reports that progress could not be saved. Export creates a JSON download. Reset requires a second confirmation. Storage events refresh the local session when another tab writes progress, but this is not a transactional multi-tab database.

## Deliberate tradeoffs

- Plain JavaScript keeps deployment and inspection simple. `app.js` still combines several UI responsibilities; separate view modules would become useful if the application grows.
- Root files support direct static hosting. `dist/` remains for existing distribution links, with a copy script and a byte-for-byte consistency check.
- Local storage avoids an account system and server database, but has no cross-device sync, tamper resistance, or guaranteed retention.
- History is stored as one JSON document. Very large histories and storage-quota exhaustion have not been stress-tested.
- Date-based streaks use the local calendar; weekly availability uses elapsed milliseconds. Both depend on the user's device clock.
- Storage normalization filters some invalid data; it is not a comprehensive schema validator for arbitrary edited assessment data.
