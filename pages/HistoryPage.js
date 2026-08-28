class HistoryPage {
  constructor(page) {
    this.page = page;
    this.view = page.getByTestId('view-history');
    this.table = page.getByTestId('history-table');
    this.emptyMessage = page.getByTestId('history-empty');
    this.clearButton = page.getByTestId('btn-clear-history');
    this.rows = page.locator('[data-testid^="history-row-"]');
  }

  row(index) {
    return this.page.getByTestId(`history-row-${index}`);
  }

  rowDate(index) {
    return this.page.getByTestId(`history-date-${index}`);
  }

  rowDifficulty(index) {
    return this.page.getByTestId(`history-difficulty-${index}`);
  }

  rowResult(index) {
    return this.page.getByTestId(`history-result-${index}`);
  }

  async rowCount() {
    return this.rows.count();
  }
}

module.exports = { HistoryPage };
