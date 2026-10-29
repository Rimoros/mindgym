# UX and implementation review

## Source material examined

- The supplied `MindGym_English_v4(1).zip`: English HTML, stylesheet, JavaScript, one-file export, README.
- The supplied `index(1).html`: earlier Russian-language app with levels, points, task generators, weekly checks, and localStorage persistence.

The latest English version already separated markup, style, and behavior and used delegated check-answer actions. It did not establish a reproducible failure for every reported Check Answer issue. The redesign replaces that interaction path and verifies it against live DOM controls; this report does not invent a specific original root cause.

## Findings and resulting changes

| Finding | Product decision |
| --- | --- |
| The English version had one simple game per skill and no meaningful difficulty control. | Nine distinct mechanics, a visible three-level selector, specific instructions, and escalating data size/rule complexity. |
| The earlier prototype had points and difficulty that disappeared in the English version. | Restore exact +2/+4/+6 and −5 rules; show point changes and keep totals separate from accuracy. |
| A three-question weekly check provided only one response per skill. | Nine fixed-structure challenges, three per skill, with an explicit warning that this is a small game-performance snapshot. |
| The active weekly attempt lived in memory. | Persist questions, state, selections, and answers; complete atomically after the final answer; retain the cooldown after reload. |
| Large decorative areas separated the user from practice. | A compact overview, useful live activity strip, and a dedicated practice room. |
| Progress lacked a temporal view and detailed history. | Actual daily accuracy points with gaps for missing activity, exact chart values, filters, and pagination. |
| Points could be mistaken for a percentage of mental ability. | Unbounded point total, clearly labeled accuracy, and no scientific or medical claim. |
| A rerender can easily leave a stale button handler or timer. | One delegated controller, a form-submit path, guarded round states, cancellation tokens, and real browser tests. |
| Switching a memory exercise can leave old asynchronous work alive. | Cancel observation on exercise, difficulty, route, or session changes. Recover expired background observation on return. |
| Automatically manufacturing a history from old summary totals would misrepresent progress. | Keep known old totals separate; import only real answer records and label missing difficulty as legacy. |
| Portfolio presentation can overstate technology or impact. | Describe the actual stack and local-only capabilities; do not fabricate usage, awards, research, or outcomes. |

## Visual direction

Warm paper, forest-green typography, restrained lime and terracotta accents. Serif headings and compact monospace labels give the project an editorial, personal character. An original inline vector composition introduces the memory/attention idea without a stock image or external dependency. Training uses a stable workspace rather than a dashboard full of repeated metric tiles.

Hover feedback, point transitions, result reveals, and slow illustration movement respect `prefers-reduced-motion`. Mobile collapses the practice controls above the exercise, keeps target grids in view, and avoids horizontal page scrolling. Color focus is explicitly optional because color recognition is intrinsic to that exercise.

## Deliberate limits

No login or backend was added: GitHub Pages stays sufficient. Local progress and the seven-day rule cannot be secured against deliberate editing. The chart reports game accuracy, which depends on difficulty mix and practice familiarity; it does not demonstrate generalized cognitive improvement. Streaks encourage activity without claiming a validated training dose.
