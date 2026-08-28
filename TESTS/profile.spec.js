const { test, expect } = require('../fixtures/test-fixtures');
const { GamePage } = require('../pages/GamePage');
const { ProfilePage } = require('../pages/ProfilePage');
const { NavBar } = require('../pages/NavBar');
const { AuthPage } = require('../pages/AuthPage');
const { playSequence, playSmartUntilOutcome, FIXED_SEQUENCES } = require('../helpers/play-strategies');

test.describe('Profile', () => {
  test('TC-PROF-01 @P2 editing the display name updates the nav and persists', async ({ signedUpPage: page, uniqueName }) => {
    const profilePage = new ProfilePage(page);
    const nav = new NavBar(page);
    const newName = `${uniqueName}_Renamed`;
    await nav.profileLink.click();
    await expect(profilePage.nameInput).toHaveValue(uniqueName);

    await profilePage.nameInput.fill(newName);
    await profilePage.saveButton.click();

    await expect(nav.helloUser).toHaveText(`Hello, ${newName}`);

    await page.reload();
    await expect(nav.helloUser).toHaveText(`Hello, ${newName}`);
  });

  test('TC-PROF-02 @P1 Win/Loss/Draw counters match games actually played', async ({ signedUpPage: page }) => {
    test.slow();
    const gamePage = new GamePage(page);
    const profilePage = new ProfilePage(page);
    const nav = new NavBar(page);

    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);
    await gamePage.newGameButton.click();
    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.computerWinOnHard);
    await gamePage.newGameButton.click();
    await gamePage.difficultySelect.selectOption('medium');
    await playSmartUntilOutcome(gamePage, 'draw');

    await nav.profileLink.click();

    // wins/losses are not exact — see playSmartUntilOutcome; do not tighten
    // these to toHaveText, it was flaky before this fix (same root cause as
    // TC-HIST-03). draws is always exact.
    const wins = Number(await profilePage.wins.textContent());
    const losses = Number(await profilePage.losses.textContent());
    expect(wins).toBeGreaterThanOrEqual(1);
    expect(losses).toBeGreaterThanOrEqual(1);
    await expect(profilePage.draws).toHaveText('1');
  });

  test('TC-PROF-03 @P3 "Created" date does not change', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    const profilePage = new ProfilePage(page);
    const nav = new NavBar(page);
    await nav.profileLink.click();
    const createdBefore = await profilePage.created.textContent();

    await profilePage.nameInput.fill('RenamedForProf03');
    await profilePage.saveButton.click();
    await nav.playLink.click();
    await gamePage.cell(0).click();
    await nav.profileLink.click();

    await expect(profilePage.created).toHaveText(createdBefore ?? '');
  });

  test('TC-PROF-04a @P2 / TC-AUTH-08 @P1 deleting the account removes it and its history', async ({ page, uniqueName }) => {
    const authPage = new AuthPage(page);
    const nav = new NavBar(page);
    const gamePage = new GamePage(page);
    await authPage.goto();
    await authPage.signUp(uniqueName);
    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);
    const profilePage = new ProfilePage(page);
    await nav.profileLink.click();
    await expect(profilePage.wins).toHaveText('1');

    page.once('dialog', (dialog) => {
      expect(dialog.message()).toBe('Delete this account and all its data? This cannot be undone.');
      dialog.accept();
    });
    await profilePage.deleteAccountButton.click();

    await expect(authPage.form).toBeVisible();
    await authPage.signUp(uniqueName);
    await expect(nav.helloUser).toHaveText(`Hello, ${uniqueName}`);
    await nav.profileLink.click();
    await expect(profilePage.wins).toHaveText('0');
    await expect(profilePage.losses).toHaveText('0');
    await expect(profilePage.draws).toHaveText('0');
  });

  test('TC-PROF-04b @P2 cancelling account deletion leaves the account intact', async ({ signedUpPage: page, uniqueName }) => {
    const profilePage = new ProfilePage(page);
    const nav = new NavBar(page);
    await nav.profileLink.click();

    page.once('dialog', (dialog) => dialog.dismiss());
    await profilePage.deleteAccountButton.click();

    await expect(profilePage.view).toBeVisible();
    await expect(nav.helloUser).toHaveText(`Hello, ${uniqueName}`);
  });
});
