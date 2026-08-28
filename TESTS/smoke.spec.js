const { test, expect } = require('../fixtures/test-fixtures');
const { AuthPage } = require('../pages/AuthPage');
const { GamePage } = require('../pages/GamePage');
const { waitForComputerReply } = require('../helpers/board');

test.describe('Smoke', () => {
  test('@smoke the app loads and a new user can sign up', async ({ page, uniqueName }) => {
    const authPage = new AuthPage(page);
    const gamePage = new GamePage(page);

    await authPage.goto();
    await authPage.signUp(uniqueName);

    await expect(gamePage.view).toBeVisible();
    await expect(gamePage.status).toHaveAttribute('data-status', 'your-turn');
  });

  test('@smoke a move can be played and the computer replies', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);

    await gamePage.cell(4).click();
    const status = await waitForComputerReply(gamePage);

    expect(status).toBe('your-turn');
    await expect(gamePage.cell(4)).toHaveAttribute('data-state', 'x');
  });
});
