# Test Plan — Tic-Tac-Toe

## 1. Scope

**SUT:** single-page Tic-Tac-Toe app. No backend — all state is stored in `localStorage`.

**In scope:** authentication, gameplay (including computer AI), profile, history, language and theme settings.

**Out of scope:** load testing, API testing (no API exists), decoding the app's minified JavaScript source, native mobile testing.

**Approach:** exploratory pass → this test plan → detailed test cases ([`TEST_CASES.md`](./TEST_CASES.md)) → Playwright/JavaScript automation for the critical flows.

**Environment:** the app must be served over `http://` (e.g. a local static server). Opening `index.html` directly via `file://` leaves the page blank — this is a known limitation, not a test defect.

**Test data / cleanup:** every test signs up its own account with a unique, timestamped name (`fixtures/test-fixtures.js`). All state lives in the browser's `localStorage`, and Playwright gives each test its own isolated browser context — so test accounts never leak into or collide with each other, and no teardown step is needed here. This would not hold on a real backend-backed app: if this SUT ever gained a real API/database, test accounts would live in a shared store, and the suite would need an explicit teardown (e.g. an `afterEach`/`afterAll` that deletes test accounts via API, or a dedicated disposable test tenant) to avoid polluting shared or production-like data. Flagging this now so it isn't missed if the app evolves past `localStorage`.

## 2. Features under test

- **Auth** — sign up (name only), log in, log out, delete account
- **Game** — 3×3 board; player is X and moves first, computer is O; difficulty (Easy/Medium/Hard); New Game, Reset; win/draw/loss detection with winning-line highlight
- **Hint** — suggests a move; disabled once the game ends
- **Profile** — edit display name, view creation date, view Win/Loss/Draw stats, delete account
- **History** — list of past games (date, difficulty, result), Clear History
- **Settings** — language (English/Persian, with RTL layout for Persian), theme (light/dark)

All state is `localStorage`- backed with no server calls — data persistence across reload is therefore a first-class concern, not an edge case.

## 3. Priority scale

| Priority | Meaning |
|---|---|
| **P0** | Blocker — core function broken, product unusable |
| **P1** | High — significant defect, workaround may exist |
| **P2** | Medium — limited functional impact |
| **P3** | Low — cosmetic or minor |

Automation and manual execution both follow this order: P0 first.

| Priority | Area | Reason |
|---|---|---|
| P0 | Authentication | gates every other feature |
| P0 | Core gameplay & result detection | primary product function |
| P0 | Persistence across reload | the only source of truth is `localStorage` |
| P1 | AI difficulty | affects game fairness/correctness |
| P1 | History accuracy | user-facing record of past games |
| P1 | Profile stats accuracy | user-facing W/L/D record |
| P2 | Hint | assistive, non-blocking feature |
| P2 | Language / RTL | visual, not logic |
| P2 | Theme toggle | cosmetic |
| P3 | Account/history deletion | destructive but low complexity |

## 4. Critical scenarios

### 4.1 Authentication
- Valid signup creates the account and lands on Play; nav greeting shows the entered name
- Empty-name signup is blocked
- Signup with an existing name is rejected with "This name is already taken. Try logging in."; existing account is not overwritten
- Login with an existing name succeeds; login with an unknown name is rejected with a visible error
- Logout ends the session; Play/Profile/History become unreachable
- Session persists across reload (user stays logged in)
- Delete Account removes the account and its history/stats

### 4.2 Core gameplay
- Player is always X and moves first; computer (O) responds after each move
- Player win (row/column/diagonal) is detected, winning cells highlighted
- Computer win and draw are detected correctly
- Clicking an occupied cell has no effect
- Clicking any cell after the game ends has no effect
- New Game resets the board
- Reset vs. New Game ⚠️ Needs clarification — requirements don't define how these differ; may be a missing spec or duplicate functionality
- No move can be registered while the computer's turn is in progress

### 4.3 AI difficulty
- Easy is beatable — computer makes detectable mistakes
- Medium blocks obvious wins but is not perfect
- Hard never loses — draw or computer win only, across multiple strategies
- Changing difficulty mid-game prompts "Change difficulty and start a new game?" — confirming applies it and restarts, cancelling keeps the current game

### 4.4 Hint
- Highlights exactly one legal, empty cell
- Does not make a move on the player's behalf
- Disabled once the game ends

### 4.5 History
- A completed game is recorded with correct date, difficulty, and result
- History persists across reload
- Multiple games are listed in a consistent order
- Clear History empties the list, shows the empty state, and also resets Profile W/L/D stats to 0/0/0 — verify this holds consistently
- History is scoped per account

### 4.6 Profile
- Display name edit updates the nav greeting immediately
- Win/Loss/Draw counters match games actually played
- "Created" date does not change
- Delete Account requires confirmation before an irreversible action — absence of confirmation is a defect

### 4.7 Language & theme
- Switching to Persian updates text and layout direction (RTL); switching back restores English/LTR
- Language and theme selections persist across reload

### 4.8 Cross-cutting
- Mid-game reload ⚠️ Needs clarification — currently discards the unfinished game with no warning; a confirmation prompt (like the difficulty-change one) may be the right safeguard, but this needs sign-off, not assumption
- Keyboard navigation: board and controls reachable and operable via Tab/Enter/Space
- No uncaught console errors across any flow above

## 5. Out of scope (detail)
- Load and concurrency testing — no backend, not applicable
- Decoding the app's minified/obfuscated JavaScript to inspect internal source. All logic (login rules, AI difficulty, etc.) is verified through the UI, as a real user would experience it — not by reading the underlying code
- Cross-browser matrix beyond Playwright's default project(s), unless time permits
- Native mobile testing

## 6. Deliverables
1. This test plan
2. Detailed test cases → [`TEST_CASES.md`](./TEST_CASES.md)
3. Playwright + JavaScript automation for P0/P1 flows: signup → play → win/loss/draw → history & profile verification → reload persistence
4. (Optional) short notes on tooling/approach decisions

## 7. Automation coverage — what's automated and what isn't

Per the task brief: "Automate the **critical flows**" — not the entire test surface. Critical, per the priority scale in section 3, means P0 and P1.

**Automated** (`TESTS/*.spec.js`): all of Authentication (P0), Core gameplay (P0), AI difficulty (P1), History (P1), Profile (P1) — including their P2/P3 sub-cases where they were cheap to add alongside an already-built P0/P1 flow (e.g. Clear History, account deletion).

**Deliberately not automated** — Hint, Language/RTL, Theme toggle, keyboard accessibility (section 4.4, 4.7, 4.8's CROSS-02). All are P2 on the priority scale: assistive or cosmetic, not part of the core game/account logic that P0/P1 covers. None of them can produce a wrong game result, lose data, or block a critical flow if broken. Automating them would be scope creep against the 3-day timebox for marginal risk reduction — they remain covered by the manual steps in `TEST_CASES.md` sections 4, 7, and 8.
