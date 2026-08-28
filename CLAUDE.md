# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A Senior Test Engineer take-home: a Playwright/JavaScript automation suite for a single-page
Tic-Tac-Toe app (`_sut/index.html`, no backend, all state in `localStorage`).

## Layout

```
_sut/                    the System Under Test (index.html) + the original task brief (INSTRUCTIONS.md)
_test-documentation/     TEST_PLAN.md, TEST_CASES.md, TEST_SUMMARY.md, bug reports (bugs/)
TESTS/                   Playwright test suites (*.spec.js) — note the uppercase name
pages/                   Page Object Model classes (one per app view/component)
fixtures/                Playwright fixtures — unique test accounts, signed-in page state
helpers/                 board reading, deterministic win/loss move sequences, retry-based draw search
playwright.config.js     testDir: './TESTS'; serves _sut/ over http:// via webServer
.github/workflows/       CI: runs the full suite on push/PR to main
```

`_sut/` and `_test-documentation/` are prefixed with `_` to sort above the automation code.
`TESTS/` is uppercase — keep every reference to it (config, npm scripts, docs, markdown links)
consistent with that exact casing. This matters beyond style: CI runs on `ubuntu-latest`, a
case-sensitive filesystem, so a stray lowercase `tests/` reference works locally on
Windows/macOS but silently finds zero tests in CI.

## Running tests

```bash
npx playwright test              # everything
npm run test:critical            # P0 + P1 only
npm run test:smoke               # fast health check
npm run test:auth                # one suite at a time (also: gameplay, ai, history, profile)
npx playwright test --grep "TC-AUTH-01"   # a single test case by ID
```

## Project skills

- **`run-tests`** — run any slice of the suite and triage the result against the one
  known-failing test (`TC-AI-03` / BUG-001), so a normal run isn't mistaken for a regression.
- **`add-test-coverage`** — automate a new feature or promote an existing manual test case to
  Playwright, following the POM/fixture/naming conventions below.
- **`manual-testing`** — act as the manual/exploratory tester: write new entries in
  `TEST_CASES.md` and file bug reports in `_test-documentation/bugs/`, using this repo's exact
  templates (see `BUG-001` for a worked example).

## Conventions to preserve

- **Locators**: always `page.getByTestId(...)`, never CSS/text selectors — see any file in `pages/`.
- **Comments**: none by default. Only where they record a non-obvious *why* (a flaky-test root
  cause, a deliberate scope decision, a workaround) — see `helpers/play-strategies.js` and
  `TESTS/history.spec.js` for the pattern to match.
- **No TypeScript / no type-checking step.** This is plain JavaScript on purpose.
- **Test IDs**: every test title starts with its case ID from `TEST_CASES.md` (`TC-AUTH-01`,
  `TC-GAME-03`, ...) plus a priority tag (`@P0`–`@P3`). Keep new tests consistent with this.
- **`TC-AI-03` (`TESTS/ai-difficulty.spec.js`) is deliberately left red, not `test.fail()`'d.**
  It asserts a real requirement ("Hard never loses") that the app currently violates
  (BUG-001, see `_test-documentation/bugs/`). Do not "fix" this test to make it pass, and do
  not mute it — the whole point is that the suite honestly reports the app's real state. It
  turns green on its own once BUG-001 is fixed in the SUT.
- **Test data needs no cleanup.** Every test signs up its own uniquely-named account
  (`fixtures/test-fixtures.js`) in an isolated Playwright browser context, so `localStorage`
  never leaks between tests. This only holds because the SUT has no shared backend — see the
  note in `TEST_PLAN.md` for what would change if it ever gained one.

## Scope

Only P0/P1 ("critical") flows are automated, per the task brief's own instruction to
"automate the critical flows" — not the full test surface. P2/P3 items (Hint, language/RTL,
theme, keyboard accessibility) are intentionally manual-only; see `TEST_PLAN.md` section 7 for
the full rationale before deciding to automate any of them.

## Before committing a change here

Run the affected suite (or `npx playwright test` for anything touching `helpers/`, `pages/`,
or `fixtures/`, since those are shared across every spec) and confirm the result still matches
`_test-documentation/TEST_SUMMARY.md` (33 passed, `TC-AI-03` failed) unless the change is
specifically about that bug or that test.
