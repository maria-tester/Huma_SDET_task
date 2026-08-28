class NavBar {
  constructor(page) {
    this.page = page;
    this.helloUser = page.getByTestId('hello-user');
    this.playLink = page.getByTestId('nav-play');
    this.profileLink = page.getByTestId('nav-profile');
    this.historyLink = page.getByTestId('nav-history');
    this.logoutButton = page.getByTestId('btn-logout');
  }

  async logOut() {
    await this.logoutButton.click();
  }
}

module.exports = { NavBar };
