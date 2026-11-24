# Testing and verification

## Verification record — 24 November 2026

The repository presentation update was based on revision `b7f3842`. Application and test files were formatted for readability; no exercise rules or UI behavior were intentionally changed.

| Check executed for this update | Result |
| --- | --- |
| `npm test` | 1,360 passing cases, including 1,350 generated rounds across 27 exercise/difficulty combinations |
| `npm run check` | JavaScript syntax checks passed; all five `dist/` files matched root source byte for byte |
| `npm run build` | Distribution copies regenerated successfully |

These are local execution results. The GitHub Actions workflow runs the logic, syntax, and distribution checks; its run status is recorded separately on GitHub.

The Node suite checks generated correct and incorrect answers, invalid numeric submissions, digit leading zeros, unordered grid selection, zero-valued selections, deduction uniqueness, target locations, exact scoring, calendar streaks, missing accuracy data, record normalization, and cooldown duration. Random rounds provide varied coverage, not exhaustive proof or a reproducible fixed random seed.

### Browser verification status

The browser integration suite was **not rerun for this update**: the execution environment prevented Chromium from starting. Consequently, this update does not claim a fresh browser, accessibility, or physical-device validation.

An earlier report records 289 passing browser assertions on 29 October 2026. Its [report](archive/verification-2026-10-29.md) and [raw output](archive/browser-results-2026-10-29.txt) are preserved as historical evidence. Later navigation changes added checks; the historical count is not a claim about the current suite.

## Run the logic and consistency checks

Use Node.js 22 or later. No dependency installation is necessary.

```sh
npm test
npm run check
```

After editing a root application file, run `npm run build` before checking. The logic tests load `dist/core.js`, and the consistency check ensures that it is identical to the root source.

## Run browser integration tests

Serve the repository root with `python3 -m http.server 8000`, then open [localhost:8000/tests/browser.html](http://localhost:8000/tests/browser.html). Click **Run integration tests** and keep the tab open until `COMPLETE` appears. Allow approximately two minutes for actual memory observation timers.

Use a disposable local browser profile. The harness temporarily clears the current origin's `mindgym_product_v5` progress entry and restores its previous snapshot in `finally`. Closing or crashing the tab midway can prevent restoration. Avoid running the harness against personal training data or in parallel with an active practice session.

The runner uses production DOM controls rather than internal controller hooks. It covers:

- All nine exercise types at all three difficulties, with correct and incorrect submissions.
- Empty-answer feedback, score changes, and duplicate-submission guards.
- Observation timer cancellation and five-question session completion.
- Weekly interruption, reload, same-question resumption, completion, and persisted cooldown.
- Progress charts, saved history, and filtering.
- Rapid route changes, content interactivity, active underline geometry, and settled animations.
- Underline transitions under reduced motion, when the browser preference is enabled.

A passing run ends with `COMPLETE` and the actual check count. `FAIL` identifies the first failure. Save the output with the date, source revision, browser version, and motion setting when recording new results.

## Responsive and accessibility review

Open [localhost:8000/tests/mobile.html](http://localhost:8000/tests/mobile.html) for iframe layout widths of 320, 390, 768, 1366, and 1920 CSS pixels. Inspect all routes, long instructions, hard grids, forms, tables, focus visibility, and horizontal overflow. These are layout viewports, not physical-device emulation.

Also check keyboard-only navigation, reduced motion, browser storage errors, and the published URL on an actual phone. Screen-reader audits, Safari/Firefox coverage, storage-quota exhaustion, very large histories, and a real seven-day elapsed-time check are not established by the Node suite or archived browser log.
