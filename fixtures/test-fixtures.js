const base = require('@playwright/test');
const { AuthPage } = require('../pages/AuthPage');

const test = base.test.extend({
  uniqueName: async ({}, use, testInfo) => {
    const unique = `QA_${testInfo.testId.slice(0, 8)}_${Date.now()}`;
    await use(unique);
  },

  signedUpPage: async ({ page, uniqueName }, use) => {
    const authPage = new AuthPage(page);
    await authPage.goto();
    await authPage.signUp(uniqueName);
    await base.expect(page.getByTestId('hello-user')).toContainText(uniqueName);
    await use(page);
  },
});

const expect = base.expect;

module.exports = { test, expect };
