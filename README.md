# Tic-Tac-Toe — QA & Automation

Senior Test Engineer take-home: test the Tic-Tac-Toe app in [`_sut/`](./_sut), document the approach, and automate the critical flows.

## Project layout

```
_sut/                    the System Under Test (index.html) + the original task brief
_test-documentation/     test plan, test cases, findings/summary, bug reports
TESTS/                   Playwright test suites (*.spec.js)
pages/                   Page Object Model classes
fixtures/                Playwright fixtures (unique test accounts, signed-in state)
helpers/                 board reading, deterministic win/loss sequences, retry-based draw search
playwright.config.js     serves _sut/ over http:// and runs the suites against it
```

`_sut/` and `_test-documentation/` are prefixed with `_` on purpose — it keeps them sorted above the automation code in a file listing, so the app-under-test and its docs stay easy to spot rather than getting lost among `TESTS/`, `pages/`, `helpers/`, etc.

## Start here

- **What's the app, what's the plan, what's in/out of scope:** [`_test-documentation/TEST_PLAN.md`](./_test-documentation/TEST_PLAN.md)
- **Every test case, automated or manual:** [`_test-documentation/TEST_CASES.md`](./_test-documentation/TEST_CASES.md)
- **Which case maps to which test (or manual result):** [`_test-documentation/TRACEABILITY_MATRIX.md`](./_test-documentation/TRACEABILITY_MATRIX.md)
- **Results, findings, open questions, suggested improvements:** [`_test-documentation/TEST_SUMMARY.md`](./_test-documentation/TEST_SUMMARY.md)
- **Bug reports:** [`_test-documentation/bugs/`](./_test-documentation/bugs/)

## Tooling

**Playwright + JavaScript.** See `TEST_PLAN.md` for why.

## Running the tests

```bash
npm install
npx playwright install chromium
npx playwright test
```

The app is served automatically (Playwright's `webServer` config spins up a static server on `_sut/` before the run) — no manual setup needed. Opening `_sut/index.html` directly via `file://` will not work; the app renders blank (see `TEST_PLAN.md`).

Run by priority or by suite instead of everything at once:

```bash
npm run test:smoke     # 2 tests, ~7s — "is the app alive" post-deploy check
npm run test:critical  # all P0 + P1 tests together
npm run test:p0        # all P0 (blocker-priority) tests
npm run test:p1        # all P1 (high-priority) tests
npm run test:auth      # TESTS/auth.spec.js only
npm run test:gameplay  # TESTS/gameplay.spec.js only
npm run test:ai        # TESTS/ai-difficulty.spec.js only
npm run test:history   # TESTS/history.spec.js only
npm run test:profile   # TESTS/profile.spec.js only
```

Or run any single test case by name: `npx playwright test --grep "TC-AUTH-01"`.

```bash
npx playwright test --ui              # interactive UI mode — best way to watch it run
npx playwright test --headed          # runs with a visible browser
npx playwright show-report            # HTML report from the last run
```

## What's automated vs. manual

All P0 + P1 ("critical") flows are automated — 34 tests across 6 suites (auth, gameplay, AI difficulty, history, profile, plus a smoke suite for deploy checks). P2/P3 items (Hint, language/theme, keyboard accessibility) are intentionally left as manual test cases. Full rationale and the manual checklist: `TEST_SUMMARY.md` sections 2 and 6.

**One test currently fails on purpose:** `TC-AI-03` asserts that "Hard" difficulty never loses to the player — it doesn't (BUG-001, see `_test-documentation/bugs/`), so the test is red. That's intentional: the suite is left honest about the app's actual state rather than muting a known failure to keep the run green.

## CI

[`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml) runs the full suite on every push/PR to `main` (Chromium, Node 22) and uploads the HTML report as a build artifact.
