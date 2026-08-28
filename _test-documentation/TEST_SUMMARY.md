# Test Summary & Findings — Tic-Tac-Toe

Status as of **2026-08-28**. Details: `TEST_PLAN.md` (scope), `TEST_CASES.md` (all cases).

## What was done

- Exploratory pass, test plan, 44 test cases (P0–P3).
- All P0 + P1 ("critical flows") automated: **34 Playwright tests across 6 suites**. 33 pass; 1 fails on purpose (see below).
- Every test also gets a free console-error check (TC-CROSS-03) via a shared fixture.
- Remaining P2/P3 cases (Hint, language/theme — 8 cases) executed manually on Chromium.
- 1 bug confirmed (BUG-001), 1 false alarm ruled out, 1 UX gap found while exploring keyboard use and logged as a suggestion (not a formal test case — never a stated requirement).

## Automated coverage

| Suite | Tests | Covers |
|---|---|---|
| Auth | 7 | signup, login, logout, duplicate/unknown name, reload, delete-account-clears-stats |
| Gameplay | 10 | turn order, win/loss/draw, board locking, New Game, Reset, move-stacking |
| AI difficulty | 5 | Easy/Medium beatable, Hard "unbeatable" claim, mid-game difficulty change |
| History | 5 | recording, reload, ordering, Clear History, per-account scoping |
| Profile | 5 | rename, W/L/D accuracy, Created date, account deletion |
| Smoke | 2 | post-deploy health check |

`TC-AI-03` fails on purpose — it asserts the real requirement ("Hard never loses"), which BUG-001 violates. Left red intentionally so the suite stays honest; it'll go green on its own once the app fixes BUG-001.

## Manual results (8 cases, Chromium)

| Result | Cases |
|---|---|
| ✅ Pass (8) | Hint ×3, Language ×3, Theme ×2 |

Keyboard use was also explored manually, off the back of TC-CROSS-02's original scope, but isn't in this table: tab order and focus visibility were fine, while a related gap (native controls don't respond to Enter/Space) doesn't map to any stated requirement, so it's reported as Suggested improvements #1 below rather than a pass/fail test result.

## Bugs

**BUG-001 — "Hard" difficulty can be beaten (Open).** A specific 4-move sequence wins 100% of the time. Full repro: `bugs/BUG-001-hard-difficulty-is-beatable.md`.

**Other observations (not bugs):** game state lives only in memory (not `localStorage`), so mid-game reload loses the game — see open questions below. AI determinism varies by difficulty (Hard deterministic, Easy/Medium randomized) — this shaped how the fixed vs. retry-based test sequences are built.

## Open questions (need a product decision)

- **Reset vs. New Game** behave identically — intentional?
- **Mid-game reload** silently discards the game — should there be a confirm prompt?

## Suggested improvements

1. **Add keyboard activation (Enter/Space) for all controls.** Tab order is logical and focus is visibly indicated everywhere — only activation is missing (pressing Enter/Space on a focused board cell or button does nothing; only a mouse/pointer click works). Likely a pointer-only event handler instead of `onClick`.
2. **Fix or re-scope "Hard"** (BUG-001) — it's currently the least trustworthy difficulty.
3. **Resolve Reset vs. New Game duplication.**
4. **Add a confirm prompt for mid-game reload**, matching the existing difficulty-change pattern.
5. **Persist in-progress game state**, not just finished games.
6. **Future scope:** a cross-browser (Firefox/WebKit) pass — this run only covered Chromium.

## Bottom line

Critical flows (P0+P1) automated and passing except one intentional, documented failure. All remaining P2/P3 cases executed manually: 8/8 pass. One confirmed bug, one ruled-out false alarm, one UX gap raised as a suggestion, two product questions raised instead of guessed at.
