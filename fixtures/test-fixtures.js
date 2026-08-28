const base = require('@playwright/test');
const { AuthPage } = require('../pages/AuthPage');

const test = base.test.extend({
  uniqueName: async ({}, use, testInfo) => {
    const unique = `QA_${testInfo.testId.slice(0, 8)}_${Date.now()}`;
    await use(unique);
  },

  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await use(page);
    base.expect(errors, `TC-CROSS-03: unexpected console/page errors:\n${errors.join('\n')}`).toEqual([]);
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
