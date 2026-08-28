class ProfilePage {
  constructor(page) {
    this.page = page;
    this.view = page.getByTestId('view-profile');
    this.nameInput = page.getByTestId('input-profile-name');
    this.saveButton = page.getByTestId('btn-save-profile');
    this.created = page.getByTestId('profile-created');
    this.wins = page.getByTestId('profile-wins');
    this.losses = page.getByTestId('profile-losses');
    this.draws = page.getByTestId('profile-draws');
    this.deleteAccountButton = page.getByTestId('btn-delete-account');
  }
}

module.exports = { ProfilePage };
