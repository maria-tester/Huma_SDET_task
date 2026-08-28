const { expect } = require('@playwright/test');

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

async function readBoard(gamePage) {
  const states = await Promise.all(
    Array.from({ length: 9 }, (_, i) => gamePage.cell(i).getAttribute('data-state'))
  );
  return states.map((s) => (s === 'x' || s === 'o' ? s : null));
}

function findWinningMove(board, mark) {
  for (const line of LINES) {
    const values = line.map((i) => board[i]);
    if (values.filter((v) => v === mark).length === 2 && values.includes(null)) {
      return line[values.indexOf(null)];
    }
  }
  return null;
}

async function waitForComputerReply(gamePage) {
  const oCountBefore = (await readBoard(gamePage)).filter((mark) => mark === 'o').length;
  await expect
    .poll(
      async () => {
        const oCountNow = (await readBoard(gamePage)).filter((mark) => mark === 'o').length;
        const status = await gamePage.status.getAttribute('data-status');
        return oCountNow > oCountBefore || (status !== 'computer-thinking' && status !== 'your-turn');
      },
      { timeout: 5000 }
    )
    .toBe(true);
  return gamePage.status.getAttribute('data-status');
}

module.exports = { LINES, readBoard, findWinningMove, waitForComputerReply };
