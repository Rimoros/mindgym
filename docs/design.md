# Design decisions

MindGym centers each session on a single exercise, a visible difficulty, and clear feedback. The overview introduces the app, practice provides the working area, and progress separates historical results from the current challenge.

| Decision | Reason |
| --- | --- |
| Nine exercise types across three skills | Offer different interactions rather than repeating one mechanic with different labels |
| Explicit difficulty selector | Make challenge size and rule complexity a user choice |
| Five-question sessions | Give practice a clear stopping point |
| Points separate from accuracy | Avoid presenting an unbounded reward total as a percentage of ability |
| Nine-question weekly check-in | Include all exercise types while keeping the result labeled as a small game-performance snapshot |
| Save an unfinished weekly attempt | Let users resume without rerolling questions |
| Gaps in the daily accuracy chart | Distinguish a day without attempts from a day with 0% accuracy |
| Exact-value chart table | Offer a text alternative to visual chart reading |
| JSON export and confirmed reset | Give users access to their records and reduce accidental deletion |
| No account or external runtime dependencies | Keep the project usable on a static host |

The visual design uses warm backgrounds, green typography, and restrained accent colors. Route transitions and a moving navigation underline communicate location; exercise feedback remains immediate.

## Accessibility scope

The implementation includes semantic landmarks, a skip link, labeled inputs and grids, visible focus states, keyboard submission, arrow-key grid navigation, status messages, and reduced-motion styles. Color focus inherently depends on color recognition; other attention exercises are available.

These implementation choices are not an accessibility certification. Screen-reader testing, contrast measurement across all states, and physical-device checks remain areas for further review.

## Background

The original redesign review is preserved in [the archive](archive/redesign-review.md). It references prototype files supplied during development; those input archives are not distributed in this repository. Treat it as historical design context rather than a current independent UX audit.
