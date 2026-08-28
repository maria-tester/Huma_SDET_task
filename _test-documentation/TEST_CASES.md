# Test Cases — Tic-Tac-Toe

Derived from [TEST_PLAN.md](./TEST_PLAN.md), section 4.
Format: **ID | Preconditions | Steps | Expected Result | Priority**

Cases marked "confirm actual behavior" cover points where the intended behavior wasn't fully unambiguous from exploratory testing. Execute them to establish the real behavior, then raise a defect if it looks wrong.

Cases marked **⚠️ Needs clarification** go further: the requirement itself is unclear (not just the implementation), and should be raised with the team/BA before — or alongside — execution.

---

## 1. Authentication

### TC-AUTH-01 — Sign up with a valid name
- **Preconditions:** App loaded, no active session, served over `http://`.
- **Steps:** Enter a valid name (e.g. `Sara`) → Create Account.
- **Expected:** Account created; navigates to Play; nav bar shows "Hello, Sara".
- **Priority:** P0

### TC-AUTH-02 — Sign up with empty name
- **Preconditions:** On Sign Up screen.
- **Steps:** Leave name empty → attempt to submit.
- **Expected:** Submission blocked; no account created.
- **Priority:** P0

### TC-AUTH-03 — Sign up with a name already in use
- **Preconditions:** Account `Sara` exists.
- **Steps:** Log out → sign up again as `Sara`.
- **Expected:** Rejected with the error "This name is already taken. Try logging in."; existing account is not overwritten.
- **Priority:** P1

### TC-AUTH-04 — Log in with an existing account
- **Preconditions:** Account `Sara` exists; logged out.
- **Steps:** Log In → enter `Sara` → submit.
- **Expected:** Logged in; prior history/stats intact.
- **Priority:** P0

### TC-AUTH-05 — Log in with a non-existent name
- **Preconditions:** No account named `Ghost`; on Log In screen.
- **Steps:** Enter `Ghost` → submit.
- **Expected:** Rejected with a visible error; no session created.
- **Priority:** P0

### TC-AUTH-06 — Log out
- **Preconditions:** Logged in as `Sara`.
- **Steps:** Click Log Out.
- **Expected:** Returned to auth screen; Play/Profile/History unreachable until re-login.
- **Priority:** P0

### TC-AUTH-07 — Session persists across reload
- **Preconditions:** Logged in as `Sara`.
- **Steps:** Reload the page.
- **Expected:** User remains logged in as `Sara`; no broken/half-rendered state.
- **Priority:** P0

### TC-AUTH-08 — Delete Account removes data
- **Preconditions:** Logged in as `Sara`, at least one game recorded.
- **Steps:** Profile → Delete Account → confirm → sign up again as `Sara`.
- **Expected:** Old account and history are gone; fresh signup starts at Win 0 / Loss 0 / Draw 0.
- **Priority:** P1

---

## 2. Core gameplay

### TC-GAME-01 — Player moves first
- **Preconditions:** New game.
- **Steps:** Observe status before any move.
- **Expected:** "Your turn (X)"; board empty.
- **Priority:** P0

### TC-GAME-02 — Computer responds after player's move
- **Preconditions:** New game.
- **Steps:** Click an empty cell.
- **Expected:** X placed in the clicked cell; computer places O in another cell shortly after; turn returns to player.
- **Priority:** P0

### TC-GAME-03 — Player win is detected
- **Preconditions:** New game, Easy difficulty.
- **Steps:** Complete a row, column, or diagonal of X.
- **Expected:** Win message shown; winning cells highlighted; board locked; Get Hint disabled.
- **Priority:** P0

### TC-GAME-04 — Computer win is detected
- **Preconditions:** New game, Hard difficulty, player plays sub-optimally.
- **Steps:** Let the computer complete a row, column, or diagonal of O.
- **Expected:** Loss message shown; board locked.
- **Priority:** P0

### TC-GAME-05 — Draw is detected
- **Preconditions:** New game.
- **Steps:** Fill the board with a known drawing sequence.
- **Expected:** Draw message shown; board locked.
- **Priority:** P0

### TC-GAME-06 — Clicking an occupied cell
- **Preconditions:** Game in progress, at least one cell filled.
- **Steps:** Click a filled cell.
- **Expected:** No change; no turn consumed.
- **Priority:** P1

### TC-GAME-07 — Board locked after game ends
- **Preconditions:** Game has ended.
- **Steps:** Click any cell.
- **Expected:** No move registered; state unchanged.
- **Priority:** P0

### TC-GAME-08 — New Game resets the board
- **Preconditions:** Game in progress or finished.
- **Steps:** Click New Game.
- **Expected:** Board clears; status returns to "Your turn (X)"; difficulty selection retained.
- **Priority:** P0

### TC-GAME-09 — Reset vs. New Game ⚠️ Needs clarification
- **Preconditions:** Game in progress.
- **Steps:** Click Reset → compare result to New Game (TC-GAME-08).
- **Expected:** Confirm actual difference, if any; behavior should not be an unexplained duplicate of New Game.
- **Open question:** the requirements don't define what Reset is supposed to do differently from New Game. Raise with the team — either the requirement is missing a distinction (e.g. Reset should also reset difficulty/stats), or one of the two buttons is duplicate functionality that shouldn't exist.
- **Priority:** P2

### TC-GAME-10 — No move-stacking during computer's turn
- **Preconditions:** Player has just moved; computer's response pending.
- **Steps:** Click multiple empty cells rapidly before the computer moves.
- **Expected:** Only the computer's own move is applied; no race condition or corrupted board state.
- **Priority:** P1

---

## 3. AI difficulty

### TC-AI-01 — Easy is beatable
- **Preconditions:** Difficulty: Easy.
- **Steps:** Play 5 games with reasonable strategy.
- **Expected:** Player wins at least some games; computer makes detectable mistakes.
- **Priority:** P1

### TC-AI-02 — Medium is competent but beatable
- **Preconditions:** Difficulty: Medium.
- **Steps:** Play 5 games with reasonable strategy.
- **Expected:** Computer blocks most obvious wins but is not flawless; no illegal moves.
- **Priority:** P2

### TC-AI-03 — Hard never loses
- **Preconditions:** Difficulty: Hard.
- **Steps:** Play 5 games with best-effort/optimal strategy.
- **Expected:** Every game ends in a draw or computer win.
- **Priority:** P1

### TC-AI-04a — Difficulty change mid-game, confirmed
- **Preconditions:** Game in progress on Easy.
- **Steps:** Change difficulty to Hard mid-game → accept the confirmation popup ("Change difficulty and start a new game?").
- **Expected:** New difficulty is applied; board resets to a new game.
- **Priority:** P2

### TC-AI-04b — Difficulty change mid-game, cancelled
- **Preconditions:** Game in progress on Hard.
- **Steps:** Change difficulty to Easy mid-game → dismiss/cancel the confirmation popup.
- **Expected:** Current game and difficulty are unchanged, including the dropdown itself (it reverts to the original difficulty, not the one that was cancelled).
- **Priority:** P2

---

## 4. Hint

### TC-HINT-01 — Hint highlights one legal cell
- **Preconditions:** New game, player's turn.
- **Steps:** Click Get Hint.
- **Expected:** Exactly one empty cell highlighted.
- **Priority:** P2

### TC-HINT-02 — Hint does not move for the player
- **Preconditions:** Hint shown (TC-HINT-01).
- **Steps:** Do not click any cell.
- **Expected:** No move is made automatically.
- **Priority:** P2

### TC-HINT-03 — Hint disabled after game ends
- **Preconditions:** Game has ended.
- **Steps:** Attempt to click Get Hint.
- **Expected:** Button disabled; no hint produced.
- **Priority:** P2

---

## 5. History

### TC-HIST-01 — Completed game appears in History
- **Preconditions:** Logged in.
- **Steps:** Play one game to completion → open History.
- **Expected:** New entry with correct date, difficulty, and result.
- **Priority:** P1

### TC-HIST-02 — History persists across reload
- **Preconditions:** At least one game recorded.
- **Steps:** Reload → open History.
- **Expected:** Previously recorded game(s) still listed.
- **Priority:** P0

### TC-HIST-03 — Multiple games listed correctly
- **Preconditions:** Play and finish 3 games with different results.
- **Steps:** Open History.
- **Expected:** All 3 entries correct; order consistent across reload.
- **Priority:** P1

### TC-HIST-04 — Clear History
- **Preconditions:** At least one game recorded, Profile shows non-zero W/L/D stats.
- **Steps:** Open History → Clear History → check History list and Profile stats.
- **Expected:** History list empties, "No games yet. Play one!" shown; Profile Win/Loss/Draw counters also reset to 0/0/0 — Clear History wipes all recorded game data, not just the list view. Verify this holds consistently (e.g. after re-login, on a second account).
- **Priority:** P2

### TC-HIST-05 — History is scoped per account
- **Preconditions:** `Sara` has recorded games; `Alex` has none.
- **Steps:** Log out of `Sara` → log in as `Alex` → open History.
- **Expected:** `Alex`'s history is empty; `Sara`'s games are not visible.
- **Priority:** P1

---

## 6. Profile

### TC-PROF-01 — Edit display name
- **Preconditions:** Logged in as `Sara`.
- **Steps:** Profile → change name to `Sara2` → Save.
- **Expected:** Nav greeting updates immediately; persists across reload.
- **Priority:** P2

### TC-PROF-02 — Win/Loss/Draw counters are accurate
- **Preconditions:** Fresh account, 0/0/0 stats.
- **Steps:** Play and finish one win, one loss, one draw → check Profile.
- **Expected:** Win 1 / Loss 1 / Draw 1.
- **Priority:** P1

### TC-PROF-03 — "Created" date is immutable
- **Preconditions:** Logged in as `Sara`; note current "Created" value.
- **Steps:** Edit name, play a game → return to Profile.
- **Expected:** "Created" value unchanged.
- **Priority:** P3

### TC-PROF-04a — Delete Account, confirmed
- **Preconditions:** Logged in as `Sara`.
- **Steps:** Profile → Delete Account → accept the confirmation popup.
- **Expected:** Account and its data are removed; user is returned to the auth screen; signing up again with `Sara` works as if the account never existed.
- **Priority:** P2

### TC-PROF-04b — Delete Account, cancelled
- **Preconditions:** Logged in as `Sara`.
- **Steps:** Profile → Delete Account → dismiss/cancel the confirmation popup.
- **Expected:** Account is untouched; still logged in as `Sara` on the Profile screen.
- **Priority:** P2

---

## 7. Language & theme

### TC-I18N-01 — Switch to Persian
- **Preconditions:** App in English.
- **Steps:** Set Language to Persian.
- **Expected:** Text translated; layout switches to RTL; no visual breakage.
- **Priority:** P2

### TC-I18N-02 — Switch back to English
- **Preconditions:** App in Persian/RTL.
- **Steps:** Set Language to English.
- **Expected:** Text and layout revert to English/LTR.
- **Priority:** P2

### TC-I18N-03 — Language persists across reload
- **Preconditions:** Language set to Persian.
- **Steps:** Reload.
- **Expected:** Still Persian/RTL.
- **Priority:** P3

### TC-THEME-01 — Toggle theme
- **Preconditions:** App in default theme.
- **Steps:** Click theme toggle.
- **Expected:** Palette switches immediately; button label reflects new state.
- **Priority:** P2

### TC-THEME-02 — Theme persists across reload
- **Preconditions:** Theme set to Dark.
- **Steps:** Reload.
- **Expected:** Still Dark.
- **Priority:** P3

---

## 8. Cross-cutting

*(TC-CROSS-02 was retired — keyboard accessibility was never a stated requirement for this app; the finding from exploring it lives in `TEST_SUMMARY.md`'s Suggested improvements instead of as a formal pass/fail case.)*

### TC-CROSS-01 — Mid-game reload ⚠️ Needs clarification
- **Preconditions:** Game in progress, unfinished.
- **Steps:** Reload the page.
- **Current behavior:** the in-progress game is lost and a new game starts — no warning is given before the reload discards it.
- **Open question:** is silently discarding an unfinished game the intended behavior? A confirmation popup before leaving/reloading (similar to the "Change difficulty and start a new game?" prompt in TC-AI-04) would be a reasonable safeguard, but this should be confirmed with the team rather than assumed as a requirement.
- **Priority:** P1

### TC-CROSS-03 — No unhandled console errors
- **Preconditions:** Dev tools open.
- **Steps:** Run full flow: signup → play a game → History → Profile → language/theme → log out.
- **Expected:** No uncaught JS errors at any step.
- **Priority:** P1
