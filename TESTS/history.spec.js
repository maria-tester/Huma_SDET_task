const { test, expect } = require('../fixtures/test-fixtures');
const { GamePage } = require('../pages/GamePage');
const { HistoryPage } = require('../pages/HistoryPage');
const { ProfilePage } = require('../pages/ProfilePage');
const { NavBar } = require('../pages/NavBar');
const { AuthPage } = require('../pages/AuthPage');
const { playSequence, playSmartUntilOutcome, FIXED_SEQUENCES } = require('../helpers/play-strategies');

test.describe('History', () => {
  test('TC-HIST-01 @P1 a completed game is recorded', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    const historyPage = new HistoryPage(page);
    const nav = new NavBar(page);
    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);

    await nav.historyLink.click();

    await expect(historyPage.rows).toHaveCount(1);
    await expect(historyPage.rowDate(0)).not.toBeEmpty();
    await expect(historyPage.rowDifficulty(0)).toHaveText('Hard');
    await expect(historyPage.rowResult(0)).toHaveText('Win');
  });

  test('TC-HIST-02 @P0 history persists across a reload', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    const historyPage = new HistoryPage(page);
    const nav = new NavBar(page);
    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);
    await nav.historyLink.click();
    await expect(historyPage.rows).toHaveCount(1);

    await page.reload();
    await nav.historyLink.click();

    await expect(historyPage.rows).toHaveCount(1);
    await expect(historyPage.rowResult(0)).toHaveText('Win');
  });

  test('TC-HIST-03 @P1 multiple games are listed correctly, newest first', async ({ signedUpPage: page }) => {
    // Row count after the draw search is not exact (see playSmartUntilOutcome) —
    // do not change back to toHaveCount(N), it was flaky before this fix.
    test.slow();
    const gamePage = new GamePage(page);
    const historyPage = new HistoryPage(page);
    const nav = new NavBar(page);

    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);
    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.computerWinOnHard);
    await nav.historyLink.click();
    const rowsBeforeDraw = await historyPage.rowCount();
    await nav.playLink.click();
    await gamePage.difficultySelect.selectOption('medium');
    await playSmartUntilOutcome(gamePage, 'draw');

    await nav.historyLink.click();

    const rowsAfterDraw = await historyPage.rowCount();
    expect(rowsAfterDraw).toBeGreaterThanOrEqual(rowsBeforeDraw + 1);
    await expect(historyPage.rowResult(0)).toHaveText('Draw');
    const allResults = await historyPage.rows.allTextContents();
    expect(allResults.some((text) => text.includes('Loss'))).toBe(true);
    expect(allResults.some((text) => text.includes('Win'))).toBe(true);

    await page.reload();
    await nav.historyLink.click();
    await expect(historyPage.rows).toHaveCount(rowsAfterDraw);
    await expect(historyPage.rowResult(0)).toHaveText('Draw');
  });

  test('TC-HIST-04 @P2 Clear History empties the list and resets profile stats', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    const historyPage = new HistoryPage(page);
    const profilePage = new ProfilePage(page);
    const nav = new NavBar(page);
    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);
    await nav.historyLink.click();
    await expect(historyPage.rows).toHaveCount(1);

    page.once('dialog', (dialog) => dialog.accept());
    await historyPage.clearButton.click();

    await expect(historyPage.rows).toHaveCount(0);
    await expect(historyPage.emptyMessage).toBeVisible();
    await nav.profileLink.click();
    await expect(profilePage.wins).toHaveText('0');
    await expect(profilePage.losses).toHaveText('0');
    await expect(profilePage.draws).toHaveText('0');
  });

  test('TC-HIST-05 @P1 history is scoped per account', async ({ page, uniqueName }) => {
    const authPage = new AuthPage(page);
    const gamePage = new GamePage(page);
    const historyPage = new HistoryPage(page);
    const nav = new NavBar(page);

    const sara = `${uniqueName}_Sara`;
    const alex = `${uniqueName}_Alex`;

    await authPage.goto();
    await authPage.signUp(sara);
    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);
    await nav.logOut();

    await authPage.signUp(alex);
    await nav.historyLink.click();

    await expect(historyPage.rows).toHaveCount(0);
    await expect(historyPage.emptyMessage).toBeVisible();
  });
});
