---
name: manual-testing
description: Act as a manual/exploratory tester for this app — write new test cases into TEST_CASES.md and file bug reports into _test-documentation/bugs/, following this repo's exact templates and severity/priority scale.
---

# Manual testing in this repo

This is the "manual tester" role: exploring the SUT (`_sut/index.html`), writing up what should
be tested as formal test cases, and filing bug reports for defects found — either during manual
exploration or surfaced by an automated test failure. This skill does not run or write Playwright
code; for that, see the `add-test-coverage` skill.

## Priority / severity scale (from `TEST_PLAN.md` section 3)

| Priority | Meaning |
|---|---|
| P0 | Blocker — core function broken, product unusable |
| P1 | High — significant defect, workaround may exist |
| P2 | Medium — limited functional impact |
| P3 | Low — cosmetic or minor |

Use the same P0–P3 scale for both test case priority and bug priority, so the two stay
comparable.

## Writing a test case → `_test-documentation/TEST_CASES.md`

1. Pick the right section (Authentication, Core gameplay, AI difficulty, Hint, History,
   Profile, Language & theme, Cross-cutting) and the next free ID in that area's sequence
   (`TC-AUTH-08`, `TC-GAME-11`, `TC-AI-05`, `TC-HIST-06`, `TC-PROF-05`, `TC-CROSS-03`, ...).
   Check the file first — don't guess the next number.
2. Use this exact template:

   ```markdown
   ### TC-<AREA>-<NN> — <short title>
   - **Preconditions:** <state the app must be in before starting>
   - **Steps:** <the minimal steps to reach the check>
   - **Expected:** <the single, verifiable expected outcome>
   - **Priority:** P<0-3>
   ```

3. If the correct behavior isn't obvious from exploring the app (implementation is ambiguous,
   but the requirement itself seems clear enough to infer) — add a note that the case
   "confirms actual behavior" rather than asserting a known spec.
4. If the *requirement itself* is unclear — not just its implementation — mark the case
   **⚠️ Needs clarification** and add one line saying what decision is actually needed. Add the
   same item to `TEST_PLAN.md` section 8 (cross-cutting / open questions) if it isn't already
   there. Do not silently assume an answer and write the case as if it were settled.
5. New P0/P1 cases are candidates for automation — flag them for the `add-test-coverage` skill
   rather than leaving them manual by default, per the scope rule in `TEST_PLAN.md` section 7.

## Filing a bug → `_test-documentation/bugs/BUG-<NNN>-<slug>.md`

1. Next number: check existing files in `_test-documentation/bugs/` first, don't reuse a number.
2. Use this exact template (see `BUG-001-hard-difficulty-is-beatable.md` for a full worked
   example):

   ```markdown
   # BUG-<NNN> — <short, specific title>

   **Status:** Open | Invalid — retracted | Fixed
   **Severity:** <impact if true — crash/data loss = High, wrong-but-recoverable = Medium, cosmetic = Low>
   **Priority:** P<0-3>
   **Found in:** <what you were doing when you found it — exploratory pass, building test X, etc.>
   **Related test cases:** [TC-XXX](../TEST_CASES.md) <one-line why it's related>

   ## Summary
   <2-4 sentences: what's wrong and why it matters>

   ## Environment
   - <browser, how the app was served, anything relevant>

   ## Steps to reproduce
   1. ...

   ## Expected result
   <what should happen>

   ## Actual result
   <what actually happens>

   ## Reproducibility
   <always / intermittent — with evidence, e.g. "10/10 manual runs">

   ## Evidence
   <link to an automated test that demonstrates it, if one exists, plus how to run it>

   ## Notes
   <anything that doesn't fit above — related findings, things ruled out>
   ```

3. **Before filing, try to disprove it.** A repro found via devtools/console DOM manipulation
   (`element.value = ...` + manual `change` event, directly editing `localStorage`, etc.) can
   produce behavior a real user interaction never would. Re-check any such finding with an
   actual click/keyboard interaction before writing it up as Open.
4. If a bug is Open and testable in a stable, deterministic way, note in **Evidence** whether it
   *should* get a regression test (see `add-test-coverage`), and whether that test should be
   written to currently fail (documenting a known defect) rather than skipped — see
   `TC-AI-03` in `TESTS/ai-difficulty.spec.js` for the precedent this repo already follows, and
   `CLAUDE.md` / the `run-tests` skill for why it stays a real failure rather than
   `test.fail()` or `test.skip()`.
5. After filing, cross-link it: add it to `TEST_SUMMARY.md` section 3 ("What was found") with
   the same one-line status shown in the report's header.

## Exploratory pass checklist

When asked to explore the app rather than execute a specific case, walk each feature area in
`TEST_PLAN.md` section 2 once, specifically trying to break assumptions: empty/duplicate
inputs, rapid double-clicks, cancelling every confirmation dialog, reloading mid-action,
switching accounts. Log anything surprising as a bug (Open) or a test case (⚠️ Needs
clarification) rather than fixing it yourself or silently deciding what the "right" behavior
should be — that decision belongs to the product owner, not the tester.
