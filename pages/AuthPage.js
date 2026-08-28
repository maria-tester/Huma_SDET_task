class AuthPage {
  constructor(page) {
    this.page = page;
    this.form = page.getByTestId('auth-form');
    this.nameInput = page.getByTestId('input-name');
    this.registerButton = page.getByTestId('btn-register');
    this.loginButton = page.getByTestId('btn-login');
    this.switchModeButton = page.getByTestId('btn-switch-mode');
    this.errorMessage = page.getByTestId('auth-error');
  }

  async goto() {
    await this.page.goto('/index.html');
  }

  async isDisplayed() {
    return this.form.isVisible();
  }

  async switchToLogin() {
    if (await this.loginButton.isVisible().catch(() => false)) return;
    await this.switchModeButton.click();
  }

  async switchToSignUp() {
    if (await this.registerButton.isVisible().catch(() => false)) return;
    await this.switchModeButton.click();
  }

  async signUp(name) {
    await this.switchToSignUp();
    await this.nameInput.fill(name);
    await this.registerButton.click();
  }

  async logIn(name) {
    await this.switchToLogin();
    await this.nameInput.fill(name);
    await this.loginButton.click();
  }
}

module.exports = { AuthPage };
