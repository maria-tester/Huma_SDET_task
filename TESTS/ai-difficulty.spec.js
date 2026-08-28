const { test, expect } = require('../fixtures/test-fixtures');
const { GamePage } = require('../pages/GamePage');
const { playSequence, FIXED_SEQUENCES } = require('../helpers/play-strategies');
const { playSmartGames } = require('../helpers/multi-game');

test.describe('AI difficulty', () => {
  test('TC-AI-01 @P1 Easy is beatable', async ({ signedUpPage: page }) => {
    test.slow();
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('easy');

    const outcomes = await playSmartGames(gamePage, 5);

    expect(outcomes).toContain('human');
  });

  test('TC-AI-02 @P2 Medium is competent but beatable', async ({ signedUpPage: page }) => {
    test.slow();
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('medium');

    const outcomes = await playSmartGames(gamePage, 5);

    expect(outcomes).not.toEqual(Array(5).fill('computer'));
  });

  // BUG-001 (_test-documentation/bugs/): intentionally left failing, not
  // test.fail()'d — this asserts the real requirement.
  test('TC-AI-03 @P1 Hard never loses', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('hard');

    const status = await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);

    expect(status).not.toBe('human');
  });

  test('TC-AI-04a @P2 confirming a mid-game difficulty change applies it and restarts', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('easy');
    await gamePage.cell(4).click();
    await expect(gamePage.cell(4)).toHaveAttribute('data-state', 'x');

    page.once('dialog', (dialog) => dialog.accept());
    await gamePage.difficultySelect.selectOption('hard');

    await expect(gamePage.difficultySelect).toHaveValue('hard');
    await expect(gamePage.cell(4)).toHaveAttribute('data-state', 'empty');
    await expect(gamePage.status).toHaveAttribute('data-status', 'your-turn');
  });

  test('TC-AI-04b @P2 cancelling a mid-game difficulty change reverts the dropdown', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('hard');
    await gamePage.cell(4).click();
    await expect(gamePage.cell(4)).toHaveAttribute('data-state', 'x');

    page.once('dialog', (dialog) => dialog.dismiss());
    await gamePage.difficultySelect.selectOption('easy');

    await expect(gamePage.cell(4)).toHaveAttribute('data-state', 'x');
    await expect(gamePage.difficultySelect).toHaveValue('hard');
  });
});
