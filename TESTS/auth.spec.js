const { test, expect } = require('../fixtures/test-fixtures');
const { AuthPage } = require('../pages/AuthPage');
const { NavBar } = require('../pages/NavBar');
const { GamePage } = require('../pages/GamePage');

test.describe('Authentication', () => {
  test('TC-AUTH-01 @P0 sign up with a valid name creates the account', async ({ page, uniqueName }) => {
    const authPage = new AuthPage(page);
    const nav = new NavBar(page);
    const gamePage = new GamePage(page);

    await authPage.goto();
    await authPage.signUp(uniqueName);

    await expect(gamePage.view).toBeVisible();
    await expect(nav.helloUser).toHaveText(`Hello, ${uniqueName}`);
  });

  test('TC-AUTH-02 @P0 sign up with an empty name is blocked', async ({ page }) => {
    const authPage = new AuthPage(page);
    const gamePage = new GamePage(page);

    await authPage.goto();
    await authPage.switchToSignUp();

    await authPage.registerButton.click();

    await expect(authPage.form).toBeVisible();
    await expect(gamePage.view).not.toBeVisible();
  });

  test('TC-AUTH-03 @P1 sign up with a name already in use is rejected', async ({ page, uniqueName }) => {
    const authPage = new AuthPage(page);
    const nav = new NavBar(page);
    const gamePage = new GamePage(page);

    await authPage.goto();
    await authPage.signUp(uniqueName);
    await nav.logOut();

    await authPage.signUp(uniqueName);

    await expect(authPage.errorMessage).toHaveText('This name is already taken. Try logging in.');
    await expect(gamePage.view).not.toBeVisible();
  });

  test('TC-AUTH-04 @P0 log in with an existing account succeeds', async ({ page, uniqueName }) => {
    const authPage = new AuthPage(page);
    const nav = new NavBar(page);
    const gamePage = new GamePage(page);

    await authPage.goto();
    await authPage.signUp(uniqueName);
    await nav.logOut();

    await authPage.logIn(uniqueName);

    await expect(gamePage.view).toBeVisible();
    await expect(nav.helloUser).toHaveText(`Hello, ${uniqueName}`);
  });

  test('TC-AUTH-05 @P0 log in with an unknown name is rejected', async ({ page, uniqueName }) => {
    const authPage = new AuthPage(page);
    const gamePage = new GamePage(page);

    await authPage.goto();

    await authPage.logIn(uniqueName);

    await expect(authPage.errorMessage).toHaveText('No account with this name. Please register.');
    await expect(gamePage.view).not.toBeVisible();
  });

  test('TC-AUTH-06 @P0 log out ends the session', async ({ signedUpPage: page }) => {
    const authPage = new AuthPage(page);
    const nav = new NavBar(page);
    const gamePage = new GamePage(page);

    await nav.logOut();

    await expect(authPage.form).toBeVisible();
    await expect(gamePage.view).not.toBeVisible();
  });

  test('TC-AUTH-07 @P0 session persists across a page reload', async ({ signedUpPage: page, uniqueName }) => {
    const nav = new NavBar(page);
    const gamePage = new GamePage(page);

    await page.reload();

    await expect(nav.helloUser).toHaveText(`Hello, ${uniqueName}`);
    await expect(gamePage.view).toBeVisible();
  });
});
