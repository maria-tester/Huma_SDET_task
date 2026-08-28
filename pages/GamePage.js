class GamePage {
  constructor(page) {
    this.page = page;
    this.view = page.getByTestId('view-play');
    this.difficultySelect = page.getByTestId('select-difficulty');
    this.status = page.getByTestId('status');
    this.board = page.getByTestId('board');
    this.newGameButton = page.getByTestId('btn-new');
    this.hintButton = page.getByTestId('btn-hint');
    this.resetButton = page.getByTestId('btn-reset');
  }

  cell(index) {
    return this.page.getByTestId(`cell-${index}`);
  }

  async isDisplayed() {
    return this.view.isVisible();
  }
}

module.exports = { GamePage };
