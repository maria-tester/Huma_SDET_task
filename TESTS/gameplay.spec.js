const { test, expect } = require('../fixtures/test-fixtures');
const { GamePage } = require('../pages/GamePage');
const { readBoard, waitForComputerReply } = require('../helpers/board');
const { playSequence, playSmartUntilOutcome, FIXED_SEQUENCES } = require('../helpers/play-strategies');

test.describe('Core gameplay', () => {
  test('TC-GAME-01 @P0 player always moves first as X', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);

    await expect(gamePage.status).toHaveAttribute('data-status', 'your-turn');
    await expect(gamePage.status).toHaveText('Your turn (X)');
    const board = await readBoard(gamePage);
    expect(board).toEqual(Array(9).fill(null));
  });

  test('TC-GAME-02 @P0 computer responds after the player moves', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);

    await gamePage.cell(4).click();
    await expect(gamePage.cell(4)).toHaveAttribute('data-state', 'x');
    const status = await waitForComputerReply(gamePage);

    expect(status).toBe('your-turn');
    const board = await readBoard(gamePage);
    expect(board.filter((mark) => mark === 'o')).toHaveLength(1);
  });

  test('TC-GAME-03 @P0 player win is detected', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('hard');

    const status = await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);

    expect(status).toBe('human');
    await expect(gamePage.status).toHaveText('You win!');
    await expect(gamePage.hintButton).toBeDisabled();
    for (let i = 0; i < 9; i++) {
      await expect(gamePage.cell(i)).toBeDisabled();
    }
  });

  test('TC-GAME-04 @P0 computer win is detected', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('hard');

    const status = await playSequence(gamePage, FIXED_SEQUENCES.computerWinOnHard);

    expect(status).toBe('computer');
    await expect(gamePage.status).toHaveText('Computer wins.');
    for (let i = 0; i < 9; i++) {
      await expect(gamePage.cell(i)).toBeDisabled();
    }
  });

  test('TC-GAME-05 @P0 draw is detected', async ({ signedUpPage: page }) => {
    test.slow();
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('medium');

    const status = await playSmartUntilOutcome(gamePage, 'draw');

    expect(status).toBe('draw');
    await expect(gamePage.status).toHaveText('Draw.');
    for (let i = 0; i < 9; i++) {
      await expect(gamePage.cell(i)).toBeDisabled();
    }
  });

  test('TC-GAME-06 @P1 clicking an occupied cell has no effect', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    await gamePage.cell(0).click();
    await waitForComputerReply(gamePage);
    const boardBefore = await readBoard(gamePage);

    await gamePage.cell(0).click({ force: true });

    const boardAfter = await readBoard(gamePage);
    expect(boardAfter).toEqual(boardBefore);
  });

  test('TC-GAME-07 @P0 board is locked after the game ends', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('hard');
    await playSequence(gamePage, FIXED_SEQUENCES.playerWinOnHard);
    const boardBefore = await readBoard(gamePage);
    const emptyIndex = boardBefore.indexOf(null);

    await gamePage.cell(emptyIndex).click({ force: true });

    const boardAfter = await readBoard(gamePage);
    expect(boardAfter).toEqual(boardBefore);
  });

  test('TC-GAME-08 @P0 New Game resets the board', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    await gamePage.difficultySelect.selectOption('medium');
    await gamePage.cell(0).click();
    await waitForComputerReply(gamePage);

    await gamePage.newGameButton.click();

    const board = await readBoard(gamePage);
    expect(board).toEqual(Array(9).fill(null));
    await expect(gamePage.status).toHaveAttribute('data-status', 'your-turn');
    await expect(gamePage.difficultySelect).toHaveValue('medium');
  });

  // ⚠️ Needs clarification (TEST_CASES.md TC-GAME-09): documents current
  // behavior, not a verified requirement — Reset === New Game today.
  test('TC-GAME-09 @P2 Reset currently behaves like New Game', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);
    await gamePage.cell(0).click();
    await waitForComputerReply(gamePage);

    await gamePage.resetButton.click();

    const board = await readBoard(gamePage);
    expect(board).toEqual(Array(9).fill(null));
    await expect(gamePage.status).toHaveAttribute('data-status', 'your-turn');
  });

  test('TC-GAME-10 @P1 no move-stacking during the computer\'s turn', async ({ signedUpPage: page }) => {
    const gamePage = new GamePage(page);

    await gamePage.cell(0).click();
    for (let i = 1; i < 9; i++) {
      await gamePage.cell(i).click({ force: true }).catch(() => {});
    }
    await waitForComputerReply(gamePage);

    const board = await readBoard(gamePage);
    expect(board.filter((mark) => mark === 'x')).toHaveLength(1);
    expect(board.filter((mark) => mark === 'o')).toHaveLength(1);
  });
});
