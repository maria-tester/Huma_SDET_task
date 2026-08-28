# Test Summary & Findings — Tic-Tac-Toe

Status as of **2026-08-28**. Read this alongside [`TEST_PLAN.md`](./TEST_PLAN.md) (scope/strategy) and [`TEST_CASES.md`](./TEST_CASES.md) (the full case list, including everything left for manual execution).

## 1. What was done

1. Exploratory pass over the whole app (auth, gameplay, AI difficulty, history, profile, language/theme).
2. Test plan written, prioritized P0–P3 by risk.
3. 44 test cases written from the plan, one per identified scenario.
4. Automated the full P0 + P1 set (the "critical flows" the task brief asks for) with Playwright + JavaScript — **34 automated tests across 6 suites**. 33 currently pass; 1 fails on purpose (see below).
5. Two defects investigated during automation; one confirmed, one retracted after a more realistic repro — see section 3.

## 2. Automated coverage

| Suite | File | Tests | Covers |
|---|---|---|---|
| Authentication | `TESTS/auth.spec.js` | 7 | signup, login, logout, duplicate name, unknown login, reload persistence |
| Core gameplay | `TESTS/gameplay.spec.js` | 10 | turn order, win/loss/draw detection, board locking, New Game, Reset, move-stacking |
| AI difficulty | `TESTS/ai-difficulty.spec.js` | 5 | Easy/Medium beatability, Hard "unbeatable" claim, mid-game difficulty change (confirm + cancel) |
| History | `TESTS/history.spec.js` | 5 | recording, reload persistence, ordering, Clear History, per-account scoping |
| Profile | `TESTS/profile.spec.js` | 5 | rename, W/L/D accuracy, Created date immutability, account deletion (confirm + cancel) |
| Smoke | `TESTS/smoke.spec.js` | 2 | fast post-deploy health check — app loads, signup works, a move round-trips through the AI |

Run with `npx playwright test` (see repo root for setup). **One test genuinely fails right now: `TC-AI-03`.** That's intentional — it asserts the real requirement ("Hard never loses"), which BUG-001 violates. It's left red on purpose rather than muted with `test.fail()`, so the suite honestly reflects the app's current state instead of hiding a known defect behind green. It'll turn green on its own once BUG-001 is fixed — no test change needed at that point.

**Not automated, by design:** Hint, Language/RTL, Theme toggle, keyboard accessibility. These are P2 — cosmetic or assistive, not part of the core game/account logic. See `TEST_PLAN.md` section 7 for the full rationale. They're written up as manual cases in `TEST_CASES.md` sections 4, 7, and 8 — that's your starting checklist for the manual pass below.

## 3. What was found

### BUG-001 — "Hard" difficulty can be beaten (Open)
Reproducible 100% of the time with a specific 4-move sequence (corner → corner → center → corner, completing a diagonal). Sampled ~25+ other move orders specifically hunting for a *draw* against Hard and never found one — every game against Hard ended in a win for one side, never a draw. That's a stronger signal than just "one exploitable line": Hard doesn't appear to play a genuinely optimal defensive game. Full repro steps: [`bugs/BUG-001-hard-difficulty-is-beatable.md`](./bugs/BUG-001-hard-difficulty-is-beatable.md).

### BUG-002 — Difficulty dropdown desync on cancel (Invalid — retracted)
Initially looked like a real bug during manual exploration (dropdown shows the new value even after cancelling the confirm popup). Turned out to be an artifact of how it was reproduced (`element.value = ...` + a manually dispatched `change` event, which skips whatever native step a real selection goes through). Automated coverage using Playwright's `selectOption()` — which drives the control the way a real user would — shows the dropdown correctly reverts. Full write-up: [`bugs/BUG-002-difficulty-select-desyncs-on-cancel.md`](./bugs/BUG-002-difficulty-select-desyncs-on-cancel.md), left in `bugs/` marked **Invalid** rather than deleted, as a record of what was checked. Worth keeping in mind for your manual pass too: if you ever reproduce something only via devtools/console, double-check it with an actual click before reporting it.

### Two other observations (not filed as bugs, just worth knowing)
- **Game state lives only in memory, not `localStorage`.** Confirms the "reload mid-game" behavior is real and not a fluke: an unfinished game is silently discarded on reload, no warning. This is flagged as an open requirements question, not a bug — see next section.
- **AI move-selection determinism varies by difficulty.** Hard is fully deterministic (same moves in → same moves out, every time) — Easy and Medium are genuinely randomized (identical player strategy produced different outcomes across repeated runs). This shaped how the automated tests are built: Hard's win/loss fixtures are single fixed sequences; the draw case needs a bounded retry loop against Medium instead.

## 4. Open questions — need a decision, not a test

These came up in either exploratory testing or automation and can't be resolved by testing alone — they need a product/requirements decision:

- **Reset vs. New Game** — currently behave identically. Is that intentional, or is one of them supposed to do something different? (`TEST_CASES.md` TC-GAME-09)
- **Mid-game reload** — silently discards the in-progress game. Intended, or should there be a confirmation prompt (the app already has the pattern — see the difficulty-change popup)? (`TEST_CASES.md` TC-CROSS-01)

## 5. Suggested improvements

Ranked by what would move the needle most for a small game like this:

1. **Fix or re-scope "Hard."** Either make it genuinely hard to beat (BUG-001), or rename/relabel it so it doesn't over-promise. Right now it's arguably the least trustworthy difficulty of the three, which is backwards.
2. **Resolve the Reset vs. New Game duplication** — either differentiate them or remove one. Two controls doing the exact same thing is confusing UX and a maintenance liability (two code paths to keep in sync for no reason).
3. **Decide on mid-game reload behavior.** A one-line confirm (`"Leave this game? Your progress will be lost."`) would be cheap to add and matches the confirmation pattern already used elsewhere in the app.
4. **Consider persisting in-progress game state**, not just completed-game history. Right now a browser crash/refresh mid-game loses the game with no trace — for an app already built around `localStorage` persistence, that's an inconsistency a user is likely to notice.
5. **Nice-to-have:** the app doesn't render at all over `file://` (blank page, no console error). If this were ever distributed as a standalone offline file rather than always served, a startup error message would beat silent blankness.

## 6. Your manual testing pass — where to start

Everything not in the "Automated coverage" table above is still open for manual execution. Concretely, that's `TEST_CASES.md`:
- **Section 4 (Hint)** — 3 cases
- **Section 7 (Language & theme)** — 5 cases
- **Section 8, CROSS-02 (keyboard accessibility)** — 1 case

Plus, since automation only covers Chromium: a quick manual sanity pass in at least one other browser (Firefox/WebKit) wouldn't hurt, given the time you have.

While you're in there manually, it's worth specifically eyeballing the two open questions in section 4 above (Reset/New Game, mid-game reload) — seeing the actual UX yourself will make it easier to argue either side when you raise them.

## 7. Bottom line

Critical flows (P0 + P1, per the task's own "automate the critical flows" instruction) are automated: 33/34 passing, 1 failing on purpose because the app genuinely doesn't meet that requirement yet (BUG-001). One genuine defect confirmed and written up with full repro steps; one false alarm caught and corrected before it became a wasted bug report. Two requirements gaps flagged for a product decision rather than guessed at. What's left is P2/P3 manual coverage, which is exactly what's scoped out in `TEST_PLAN.md` and listed above.
