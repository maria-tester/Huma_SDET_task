const { readBoard, waitForComputerReply } = require('./board');
const { pickSmartMove, DEFAULT_PRIORITY } = require('./play-strategies');

async function playSmartGames(gamePage, count, priority = DEFAULT_PRIORITY) {
  const outcomes = [];
  for (let i = 0; i < count; i++) {
    await gamePage.newGameButton.click();
    let status = await gamePage.status.getAttribute('data-status');
    while (status === 'your-turn') {
      const board = await readBoard(gamePage);
      const move = pickSmartMove(board, priority);
      if (move === null) break;
      await gamePage.cell(move).click();
      status = await waitForComputerReply(gamePage);
    }
    outcomes.push(status);
  }
  return outcomes;
}

module.exports = { playSmartGames };
