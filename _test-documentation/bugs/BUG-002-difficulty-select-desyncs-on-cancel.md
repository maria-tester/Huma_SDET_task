# BUG-002 — Difficulty dropdown desyncs after cancelling a mid-game change

**Status:** Invalid — retracted
**Severity:** N/A (not a real defect)
**Priority:** N/A
**Found in:** manual exploratory testing of the AI-difficulty confirm/cancel flow
**Related test cases:** [TC-AI-04b](../TEST_CASES.md) (cancelling a mid-game difficulty change reverts the dropdown)

## Summary
Initially looked like a real bug: after cancelling the "change difficulty and start a new game?"
confirmation, the difficulty `<select>` still showed the newly picked value instead of reverting
to the value active before the change. Retracted after a more realistic repro — see below.

## Environment
- App served locally over `http://` (e.g. `npx http-server ./_sut`)
- Chromium, reproduced manually via browser devtools

## Original (invalid) steps to reproduce
1. Start a game on Hard, play a move.
2. In devtools, set the `<select>` element's `.value` to `easy` and manually dispatch a
   `change` event, rather than actually clicking/selecting the option.
3. Cancel the resulting confirmation dialog.
4. Observe the dropdown still displays `easy`.

## Why this was retracted
Setting `element.value` + manually dispatching `change` skips whatever native selection step a
real user interaction goes through, so it does not faithfully reproduce a real click. Automated
coverage using Playwright's `selectOption()` — which drives the control the way an actual user
would — shows the dropdown correctly reverts to `hard` after cancel. See
[`TESTS/ai-difficulty.spec.js`](../../TESTS/ai-difficulty.spec.js), test
`TC-AI-04b @P2 cancelling a mid-game difficulty change reverts the dropdown`, which passes.

## Reproducibility
Not reproducible through real user interaction (mouse click / keyboard selection). Only
reproducible via direct DOM manipulation that bypasses the browser's native `<select>` behavior.

## Notes
Kept in `bugs/` marked **Invalid** rather than deleted, as a record of what was checked and why
it doesn't hold. General lesson for manual testing: if a repro only works via devtools/console
DOM manipulation, double-check it with an actual click/keyboard interaction before reporting it
as a defect.
