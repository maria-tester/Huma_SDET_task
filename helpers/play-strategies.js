const { readBoard, findWinningMove, waitForComputerReply } = require('./board');

const DEFAULT_PRIORITY = [4, 0, 2, 6, 8, 1, 3, 5, 7];

function pickSmartMove(board, priority = DEFAULT_PRIORITY) {
  const win = findWinningMove(board, 'x');
  if (win !== null) return win;
  const block = findWinningMove(board, 'o');
  if (block !== null) return block;
  const next = priority.find((i) => board[i] === null);
  return next === undefined ? null : next;
}

async function playSequence(gamePage, sequence) {
  let status = await gamePage.status.getAttribute('data-status');
  for (const index of sequence) {
    if (status !== 'your-turn') break;
    // skip cells the computer already claimed, or this clicks a disabled cell
    const state = await gamePage.cell(index).getAttribute('data-state');
    if (state !== 'empty') continue;
    await gamePage.cell(index).click();
    status = await waitForComputerReply(gamePage);
  }
  return status;
}

async function playSmartUntilOutcome(gamePage, targetOutcome, { maxAttempts = 15, priority = DEFAULT_PRIORITY } = {}) {
  let status;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await gamePage.newGameButton.click();
    status = await gamePage.status.getAttribute('data-status');
    while (status === 'your-turn') {
      const board = await readBoard(gamePage);
      const move = pickSmartMove(board, priority);
      if (move === null) break;
      await gamePage.cell(move).click();
      status = await waitForComputerReply(gamePage);
    }
    if (status === targetOutcome) return status;
  }
  throw new Error(`Could not reach outcome "${targetOutcome}" within ${maxAttempts} attempts (last: "${status}")`);
}

// These sequences only work because Hard's AI is fully deterministic today
// (see TEST_SUMMARY.md). If Hard's move logic ever changes — including a fix
// for BUG-001 — these move orders may stop producing the labeled outcome and
// will need to be re-derived, not just re-timed.
const FIXED_SEQUENCES = {
  playerWinOnHard: [0, 2, 4, 6],
  computerWinOnHard: [0, 1, 2, 3, 5, 6, 7, 8],
};

module.exports = { pickSmartMove, playSequence, playSmartUntilOutcome, FIXED_SEQUENCES, DEFAULT_PRIORITY };
