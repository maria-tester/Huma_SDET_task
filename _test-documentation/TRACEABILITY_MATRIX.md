# Traceability Matrix — Tic-Tac-Toe

Maps every test case in [`TEST_CASES.md`](./TEST_CASES.md) to its automated test (if any) or its manual execution result. 43 cases total: 34 automated, 8 executed manually (all pass), 1 open question with no test yet.

Legend: 🤖 Automated · 👤 Manual (Pass) · ⚠️ Not tested — open question

| TC ID | Priority | Status | Location |
|---|---|---|---|
| **1. Authentication** | | | |
| TC-AUTH-01 | P0 | 🤖 | `TESTS/auth.spec.js` |
| TC-AUTH-02 | P0 | 🤖 | `TESTS/auth.spec.js` |
| TC-AUTH-03 | P1 | 🤖 | `TESTS/auth.spec.js` |
| TC-AUTH-04 | P0 | 🤖 | `TESTS/auth.spec.js` |
| TC-AUTH-05 | P0 | 🤖 | `TESTS/auth.spec.js` |
| TC-AUTH-06 | P0 | 🤖 | `TESTS/auth.spec.js` |
| TC-AUTH-07 | P0 | 🤖 | `TESTS/auth.spec.js` |
| TC-AUTH-08 | P1 | 🤖 | `TESTS/profile.spec.js` (combined with TC-PROF-04a — same flow) |
| **2. Core gameplay** | | | |
| TC-GAME-01 | P0 | 🤖 | `TESTS/gameplay.spec.js` |
| TC-GAME-02 | P0 | 🤖 | `TESTS/gameplay.spec.js` |
| TC-GAME-03 | P0 | 🤖 | `TESTS/gameplay.spec.js` |
| TC-GAME-04 | P0 | 🤖 | `TESTS/gameplay.spec.js` |
| TC-GAME-05 | P0 | 🤖 | `TESTS/gameplay.spec.js` |
| TC-GAME-06 | P1 | 🤖 | `TESTS/gameplay.spec.js` |
| TC-GAME-07 | P0 | 🤖 | `TESTS/gameplay.spec.js` |
| TC-GAME-08 | P0 | 🤖 | `TESTS/gameplay.spec.js` |
| TC-GAME-09 ⚠️ | P2 | 🤖 | `TESTS/gameplay.spec.js` (characterization test — see open question below) |
| TC-GAME-10 | P1 | 🤖 | `TESTS/gameplay.spec.js` |
| **3. AI difficulty** | | | |
| TC-AI-01 | P1 | 🤖 | `TESTS/ai-difficulty.spec.js` |
| TC-AI-02 | P2 | 🤖 | `TESTS/ai-difficulty.spec.js` |
| TC-AI-03 | P1 | 🤖 | `TESTS/ai-difficulty.spec.js` — **fails on purpose, BUG-001** |
| TC-AI-04a | P2 | 🤖 | `TESTS/ai-difficulty.spec.js` |
| TC-AI-04b | P2 | 🤖 | `TESTS/ai-difficulty.spec.js` |
| **4. Hint** | | | |
| TC-HINT-01 | P2 | 👤 | Manual — Pass |
| TC-HINT-02 | P2 | 👤 | Manual — Pass |
| TC-HINT-03 | P2 | 👤 | Manual — Pass |
| **5. History** | | | |
| TC-HIST-01 | P1 | 🤖 | `TESTS/history.spec.js` |
| TC-HIST-02 | P0 | 🤖 | `TESTS/history.spec.js` |
| TC-HIST-03 | P1 | 🤖 | `TESTS/history.spec.js` |
| TC-HIST-04 | P2 | 🤖 | `TESTS/history.spec.js` |
| TC-HIST-05 | P1 | 🤖 | `TESTS/history.spec.js` |
| **6. Profile** | | | |
| TC-PROF-01 | P2 | 🤖 | `TESTS/profile.spec.js` |
| TC-PROF-02 | P1 | 🤖 | `TESTS/profile.spec.js` |
| TC-PROF-03 | P3 | 🤖 | `TESTS/profile.spec.js` |
| TC-PROF-04a | P2 | 🤖 | `TESTS/profile.spec.js` (combined with TC-AUTH-08) |
| TC-PROF-04b | P2 | 🤖 | `TESTS/profile.spec.js` |
| **7. Language & theme** | | | |
| TC-I18N-01 | P2 | 👤 | Manual — Pass |
| TC-I18N-02 | P2 | 👤 | Manual — Pass |
| TC-I18N-03 | P3 | 👤 | Manual — Pass |
| TC-THEME-01 | P2 | 👤 | Manual — Pass |
| TC-THEME-02 | P3 | 👤 | Manual — Pass |
| **8. Cross-cutting** | | | |
| TC-CROSS-01 ⚠️ | P1 | ⚠️ | Not tested — open requirements question, no pass/fail applies yet |
| TC-CROSS-03 | P1 | 🤖 | `fixtures/test-fixtures.js` — global check, runs automatically on **every** automated test, not a standalone test file |

*(TC-CROSS-02 was retired — see `TEST_CASES.md` section 8. Keyboard accessibility was never a stated requirement; the finding from exploring it is a suggested improvement in `TEST_SUMMARY.md`, not a test case.)*

## Reading this table

- **🤖 Automated** means there's a real, currently-passing-or-intentionally-failing Playwright test. TC-AI-03 is the one exception: automated and failing on purpose (BUG-001) — see [`TEST_SUMMARY.md`](./TEST_SUMMARY.md).
- **👤 Manual** cases were executed once by hand on Chromium — not re-run automatically, so they can silently go stale after a code change. Full results and notes: `TEST_SUMMARY.md`.
- **⚠️ TC-CROSS-01** has no test at all yet, automated or manual — it's blocked on a product decision (does mid-game reload need a confirmation prompt?), not on effort. See `TEST_SUMMARY.md`.
- Coverage percentages, if you need them for a report: **34/43 (79%) automated, 8/43 (19%) manual — all passing, 1/43 (2%) blocked on an open question.**
