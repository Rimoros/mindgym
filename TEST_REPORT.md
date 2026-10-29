# MindGym verification report

Executed on 29 October 2026. This report separates actual execution from implementation review and remaining limits.

## Executed automated checks

### Pure logic (Node)

Command: `node tests/core.test.cjs`

**1,360 passing tests**, including **1,350 independently generated rounds**: 50 instances for every one of the 27 game/difficulty combinations.

Checks include:

- Accept the generated correct answer; reject a wrong answer.
- Validate missing answers without a point penalty.
- Enforce leading zeroes in digit recall.
- Treat pattern selection as an unordered set and reject incomplete/extra selections.
- Accept cell/choice index zero as a valid selection.
- Ensure search target indices match the rendered source data.
- Ensure object targets match their stored locations.
- Independently resolve deduction clues and verify exactly one valid option.
- Award exactly +2/+4/+6 or −5; allow negative totals.
- Calculate calendar streaks across a month boundary and through yesterday.
- Distinguish missing accuracy data from 0% accuracy.
- Reject invalid records and normalize point values on storage load.
- Use an exact 604,800,000 ms / 168-hour cooldown duration.

`node --check` also passed for both production JavaScript files.

### Browser integration (Chromium)

**289 passing assertions, zero failures in the completed run.** Full output is preserved in `tests/browser-results.txt`.

The suite loads the production app in an iframe and invokes its actual controls. It does not call internal controller functions or bypass the production validators. Memory tasks use their real 3–5 second observation periods.

Covered:

- Every exercise and difficulty with both correct and incorrect answers.
- Empty-answer feedback and zero score change for invalid submissions.
- Exact score changes in the header.
- Removal/guarding of answer controls after a committed result.
- Canceling a running memory timer while changing difficulty/exercise.
- Five-question session completion and restart.
- Beginning a weekly assessment and interrupting a memory observation with a reload.
- Resuming with the identical stored question ID.
- Completing all nine weekly questions correctly, including all memory grids.
- Saving the full per-skill assessment result.
- Clearing the completed active attempt.
- Hiding the weekly restart action after completion, including after reload.
- Building a progress chart from actual completed attempts.
- Showing saved history and applying a skill filter.

During development, an initial run exposed a background-observation timing issue, which was fixed. A later run exposed an assumption in the test runner that the weekly screen had a practice difficulty selector; the runner was corrected to read the weekly question's displayed level. The successful final run is the one recorded in the log.

## Additional interactive browser checks

- Desktop overview and practice navigation at approximately 1,350 px browser width.
- Narrow layouts at 320, 390, and 768 CSS pixels using the supplied viewport harness; width checks found no horizontal document overflow on the inspected pages.
- On a narrow viewport, an empty numeric submission showed validation, then a correct answer submitted with Enter awarded +2.
- On a roughly 320 px frame, the hard 8×8 attention grid accepted a cell selection, checked it correctly, and awarded +6.
- Mobile hero reviewed visually and revised from a cramped two-column layout to a readable single column.
- Console logs inspected: no errors originating from the MindGym page or its scripts were observed in the completed flows. The environment emitted unrelated `chrome-extension://` metadata errors; those are not application errors.

## Implementation review

- Relative local assets; no external scripts, fonts, analytics, or required APIs.
- Production files contain no seeded histories or artificial user metrics.
- Seven-day gate uses the latest completion timestamp, not a decorative disabled label.
- Storage failure notices, data export, explicit reset confirmation, and known-key legacy migration are present.
- Motion overrides exist under `prefers-reduced-motion: reduce`.
- Chart data has exact-value text/table alternatives. Form fields and grid cells are labeled; keyboard focus and arrow navigation are implemented.

## Scope limits

- Mobile testing used narrow Chromium layout viewports, **not a physical phone**, a touch device, or iOS Safari.
- No complete screen-reader audit, automated accessibility certification, or operating-system reduced-motion toggle test was performed.
- No actual seven-day wait was conducted. The duration arithmetic and persisted locked state were checked; the clock and localStorage remain user-controlled.
- No GitHub Pages deployment was performed in the user's GitHub account. Instructions were checked against GitHub's official documentation. Static publication remains a separate user action.
- Export is available; importing exported JSON is not implemented. Local browser data is not synchronized across devices.
- Browser storage quota exhaustion, long-term history growth, and every legacy-data shape were not exhaustively simulated in a browser.

A passing test suite covers the scenarios above; it is not a claim that every browser or possible input has been tested.
