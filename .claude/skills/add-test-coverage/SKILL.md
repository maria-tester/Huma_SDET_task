---
name: add-test-coverage
description: Add Playwright automation for a new app feature, or promote an existing manual test case (from TEST_CASES.md) to automated — following this repo's POM/fixture/naming conventions and keeping the docs in sync.
---

# Adding test coverage in this repo

Use this for two situations: the SUT gained a new feature that needs test cases and
automation, or an existing **manual** test case in `_test-documentation/TEST_CASES.md` should
become **automated**.

## 1. New feature → test cases → automation

1. Add the feature to `_test-documentation/TEST_PLAN.md` section 2 (features under test) and
   assign it a priority (P0–P3) per the scale in section 3 — be explicit about *why*, matching
   the existing rows.
2. Write the test cases themselves using the `manual-testing` skill — it owns the
   `TEST_CASES.md` template, numbering scheme, and the "needs clarification" convention. Don't
   duplicate that format here; hand off to it, then come back to automate.
3. Only automate P0/P1 cases per this repo's stated scope (`TEST_PLAN.md` section 7) unless the
   user explicitly asks for broader coverage. P2/P3 stay manual by default.
4. Add `data-testid` attribute assumptions only if they already exist in `_sut/index.html` —
   this suite tests the real SUT as shipped, it does not modify the SUT to make automation
   easier. If a needed `data-testid` is missing, say so rather than inventing a fragile
   text/CSS locator workaround.

## 2. Automate an existing manual test case

1. Find the case in `_test-documentation/TEST_CASES.md` (sections 4, 7, 8 currently hold the
   manual-only ones: Hint, Language/RTL, Theme, keyboard accessibility).
2. Check whether a Page Object already exists for the relevant view in `pages/`. Add one only
   if none fits — follow the existing pattern (constructor wires up `getByTestId` locators,
   thin methods for multi-step actions, no logic beyond that).
3. Write the test into the matching spec file in `TESTS/` (or a new one, named after the
   feature area, if none fits — e.g. `TESTS/hint.spec.js`). Keep the title format
   `TC-<ID> @P<n> <description>` exactly like the existing tests.
4. Reuse `fixtures/test-fixtures.js` (`signedUpPage`, `uniqueName`) instead of re-implementing
   signup in the new test.
5. After the test passes locally, update:
   - `_test-documentation/TEST_PLAN.md` section 7 — move the case out of "deliberately not
     automated" if it was listed there, and say why the calculus changed.
   - `_test-documentation/TEST_SUMMARY.md` section 2 (automated coverage table) — add the
     suite/count.
   - `README.md` — add an `npm run test:<area>` script in `package.json` if this is a new spec
     file, and document it the same way the existing ones are documented.

## Conventions (see also `CLAUDE.md`)

- Locators via `page.getByTestId(...)` only.
- No comments except where they record a non-obvious *why* (see `helpers/play-strategies.js`,
  `TESTS/history.spec.js` for the bar to match).
- Plain JavaScript, no TypeScript, no type-checking step.
- Every new test needs a `TC-ID` and a priority tag, and must appear in `TEST_CASES.md` before
  (or alongside) the automation — don't automate a scenario that was never written up as a
  case.

## After adding coverage

Run the new/changed spec file directly (`npx playwright test TESTS/<file>.spec.js`), then run
the full suite once to confirm nothing else regressed. Use the `run-tests` skill's triage rule
for reading the result — `TC-AI-03` failing is still expected and is not related to this work.

If automating a case surfaces a real defect (the app doesn't do what the case says it should),
don't silently "fix" the test to match broken behavior — use the `manual-testing` skill to file
a bug report, then decide with the user whether the new test should assert the real requirement
and stay red (like `TC-AI-03`) until the app is fixed, the same way BUG-001 was handled.
