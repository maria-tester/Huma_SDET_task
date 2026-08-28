# BUG-001 — "Hard" difficulty can be beaten by the player

**Status:** Open
**Severity:** Medium (no crash/data loss, but core game-fairness logic is wrong)
**Priority:** P1
**Found in:** exploratory testing while building automated coverage for TC-GAME-03/04/05 and TC-AI-03
**Related test cases:** [TC-AI-03](../TEST_CASES.md) (Hard never loses), [TC-GAME-03](../TEST_CASES.md) (player win detected — uses this bug's repro sequence as its test fixture)

## Summary
On "Hard" difficulty, the computer opponent can be reliably beaten by the player. For a game commonly expected to be unbeatable (or at worst drawable) on its hardest setting, this is a defect in the AI's move logic, not just a difficulty-tuning nitpick.

## Environment
- App served locally over `http://` (e.g. `npx http-server ./_sut`)
- Chromium (Playwright), also manually reproduced in browser

## Steps to reproduce
1. Sign up / log in.
2. Set **Difficulty** to **Hard**.
3. Start a new game (player is X, moves first).
4. Click cells in this exact order, waiting for the computer's reply between each: **top-left (0) → top-right (2) → center (4) → bottom-left (6)**.
5. Observe the result after the 4th click.

## Expected result
On Hard difficulty, the AI should provide a consistently strong level of play and should not be reliably exploitable through the same deterministic move sequence. For this scenario, the computer should recognize and respond to the developing threat, preventing the player from consistently winning via the same sequence.

## Actual result
The player wins every time — X completes the anti-diagonal (cells 2-4-6). Computer's second move (an edge cell) does not contest the fork created after the player takes both opposite corners plus the center.

## Reproducibility
**100% (10/10 manual runs, plus every automated run).** This is not a flaky/occasional AI mistake — the computer's replies to this exact move sequence are fully deterministic (same input, same output every time), and it loses via this line every single time.

## Evidence
- Automated regression: [`TESTS/ai-difficulty.spec.js`](../../TESTS/ai-difficulty.spec.js), test `TC-AI-03 @P1 Hard never loses`. This test asserts the actual requirement and is left genuinely failing (not `test.skip`/`test.fail`'d, not muted) — it's part of the normal suite run and shows red until this bug is fixed. Reproduce with:
  ```
  npx playwright test TESTS/ai-difficulty.spec.js --grep "TC-AI-03"
  ```
  Playwright captures a screenshot automatically on failure (`playwright.config.js`, `screenshot: 'only-on-failure'`), saved to `test-results/`; run with `--trace on` for a full step-by-step trace if a screenshot alone isn't convincing enough for a logic bug like this one.


## Notes
- Medium and Easy were not evaluated for this specific defect (weaker difficulties being beatable is expected/by design). Medium was observed to have genuine move randomization (same player strategy produced different outcomes across repeated runs) — Hard did not show this randomization, which is what makes it deterministically exploitable.
