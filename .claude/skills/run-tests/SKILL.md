---
name: run-tests
description: Run this project's Playwright suite (all, by priority, or by feature) and triage the results against the one known-failing test (TC-AI-03 / BUG-001), so a routine run doesn't get reported as a regression.
---

# Running and triaging tests in this repo

## Commands

Pick the narrowest command that answers the question being asked — don't default to the full
suite if only one feature area is relevant.

```bash
npx playwright test              # everything
npm run test:critical            # P0 + P1 only — the "is anything critical broken" check
npm run test:smoke               # ~7s health check: app loads, signup works, one move round-trips
npm run test:p0                  # blocker-priority only
npm run test:p1                  # high-priority only
npm run test:auth                # TESTS/auth.spec.js
npm run test:gameplay            # TESTS/gameplay.spec.js
npm run test:ai                  # TESTS/ai-difficulty.spec.js
npm run test:history             # TESTS/history.spec.js
npm run test:profile             # TESTS/profile.spec.js
npx playwright test --grep "TC-AUTH-01"   # a single test case by ID
npx playwright test --ui                  # interactive mode, for debugging a failure
npx playwright show-report                # HTML report from the last run
```

## Triage rule: one failure is expected

`TC-AI-03` in `TESTS/ai-difficulty.spec.js` ("Hard never loses") is **expected to fail** on
every run. It documents a real, open, unfixed application bug (BUG-001 — "Hard" difficulty is
beatable; see `_test-documentation/bugs/BUG-001-hard-difficulty-is-beatable.md`). It is
deliberately written as a normal failing assertion, not muted with `test.fail()` or
`test.skip()` — the team's choice is to keep the suite honest about the app's real state
rather than hide the defect behind a green run.

So, after any test run:

1. **Expected baseline**: 33 passed, 1 failed (`TC-AI-03`). This matches
   `_test-documentation/TEST_SUMMARY.md`.
2. If the result matches that baseline exactly → **nothing to report**, this is a normal run.
3. If `TC-AI-03` now **passes** → BUG-001 has apparently been fixed in the SUT. Flag this
   explicitly — it's good news, but it means the test/comments referencing BUG-001 as open
   should be revisited (do not silently leave stale "known bug" language in the docs).
4. If **any other test fails**, or the total pass count drops below 33 → this is a real
   regression. Report it as such; do not lump it in with the expected `TC-AI-03` failure or
   describe the run as "all good except the known issue" when something new broke.
5. Never edit `TC-AI-03`, `test.fail()`-wrap it, or otherwise make it pass artificially to get
   a fully green run — that was tried and explicitly reverted (see CLAUDE.md).

## Where to look after a run

- Full findings/rationale: `_test-documentation/TEST_SUMMARY.md`
- Every test case, automated or manual: `_test-documentation/TEST_CASES.md`
- Scope decisions (why P2/P3 isn't automated): `_test-documentation/TEST_PLAN.md` section 7
- Bug write-ups: `_test-documentation/bugs/`
