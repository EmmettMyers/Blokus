const { can_play_piece } = require("../src/gameLogic/checks");
const { valid_block } = require("../src/gameLogic/checks");
const { diagonals_present } = require("../src/gameLogic/checks");
const { on_player_edge } = require("../src/gameLogic/checks");

describe("can_play_piece function", () => {
  test("Basic valid play on player edge", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(can_play_piece(matrix, piece, 0, 0, "blue")).toBe(true);
  });

  test("Basic valid play on connecting edge", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[0][0] = "red";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(can_play_piece(matrix, piece, 1, 1, "red")).toBe(true);
  });

  test("Basic valid double play on player edge", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[2][2] = "red";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(
      can_play_piece(matrix, piece, 3, 0, "red") &&
        can_play_piece(matrix, piece, 3, 3, "red")
    ).toBe(true);
  });

  test("Basic invalid play on player edge, piece would go off board", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[0][18] = "red";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(can_play_piece(matrix, piece, 1, 19, "red")).toBe(false);
  });

  test("Basic invalid play on point not on the board", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(can_play_piece(matrix, piece, -3, 2, "red")).toBe(false);
  });

  test("Basic invalid play on player edge when another piece is blocking", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[1][1] = "red";
    matrix[3][3] = "blue";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(can_play_piece(matrix, piece, 2, 2, "red")).toBe(false);
  });

  test("Invalid play on player edge when two pieces of different colors are blocking", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[1][1] = "red";
    matrix[3][2] = "blue";
    matrix[3][3] = "green";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(can_play_piece(matrix, piece, 2, 2, "red")).toBe(false);
  });

  test("Valid play in each corner of gameboard", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(
      can_play_piece(matrix, piece, 0, 0, "blue") &&
        can_play_piece(matrix, piece, 0, 18, "red") &&
        can_play_piece(matrix, piece, 18, 18, "green") &&
        can_play_piece(matrix, piece, 18, 0, "yellow")
    ).toBe(true);
  });

  test("Invalid play on entirely filled board", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill("red"));
    matrix[1][1] = "red";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(can_play_piece(matrix, piece, 2, 2, "blue")).toBe(false);
  });

  test("Valid play with a larger piece", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[1][1] = "red";
    const piece = [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ];
    expect(can_play_piece(matrix, piece, 2, 2, "red")).toBe(true);
  });

  test("Valid play with a larger piece when another different colored piece overlaps, but doesn't block", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[0][0] = "red";
    matrix[1][2] = "blue";
    const piece = [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ];
    expect(can_play_piece(matrix, piece, 1, 1, "red")).toBe(true);
  });

  test("Invalid play with a larger piece (barely goes off board)", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[16][17] = "red";
    const piece = [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ];
    expect(can_play_piece(matrix, piece, 17, 18, "red")).toBe(false);
  });

  test("Invalid play with a larger piece when a piece of the same color is touching nondiagonally", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[0][0] = "red";
    matrix[1][2] = "red";
    const piece = [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ];
    expect(can_play_piece(matrix, piece, 1, 1, "red")).toBe(false);
  });

  test("Valid play with a larger piece on a larger board", () => {
    const matrix = Array.from({ length: 100 }, () => Array(100).fill(""));
    matrix[1][1] = "red";
    const piece = [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ];
    expect(can_play_piece(matrix, piece, 2, 2, "red")).toBe(true);
  });

  test("Valid plays with two different pieces", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[1][1] = "red";
    matrix[7][7] = "yellow";
    const piece1 = [
      [1, 1],
      [1, 1],
    ];
    const piece2 = [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ];
    expect(can_play_piece(matrix, piece1, 2, 2, "red") && can_play_piece(matrix, piece2, 8, 8, "yellow")).toBe(true);
  });

  test("Inalid plays with two different pieces", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[1][1] = "red";
    matrix[9][8] = "yellow";
    const piece1 = [
      [1, 1],
      [1, 1],
    ];
    const piece2 = [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ];
    expect(can_play_piece(matrix, piece1, -2, -5, "red") && can_play_piece(matrix, piece2, 8, 8, "yellow")).toBe(false);
  });
});

describe("valid_block function", () => {
  test("Basic valid block check", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(valid_block(matrix, 0, 0, "blue")).toBe(true);
  });

  test("Basic valid block check, not starting block", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(valid_block(matrix, 1, 1, "blue")).toBe(true);
  });

  test("Basic invalid block check (off the gameboard)", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(valid_block(matrix, 0, 21, "red")).toBe(false);
  });
});

describe("diagonals_present function", () => {
  test("Basic valid bottom right diagonal check", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[2][2] = "blue";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(diagonals_present(matrix, 1, 1, "blue")).toBe(true);
  });

  test("Basic valid bottom left diagonal check", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[3][1] = "blue";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(diagonals_present(matrix, 2, 2, "blue")).toBe(true);
  });

  test("Basic valid top right diagonal check", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[1][1] = "blue";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(diagonals_present(matrix, 0, 2, "blue")).toBe(true);
  });

  test("Basic valid top left diagonal check", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[2][2] = "blue";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(diagonals_present(matrix, 1, 1, "blue")).toBe(true);
  });

  test("Basic invalid diagonal check (piece of other color)", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[2][2] = "red";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(diagonals_present(matrix, 1, 1, "blue")).toBe(false);
  });

  test("Basic invalid diagonal check (piece off the board)", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    matrix[19][19] = "red";
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(diagonals_present(matrix, 20, 20, "blue")).toBe(false);
  });
});

describe("on_player_edge function tests", () => {
  test("Basic valid player edge check (blue)", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(on_player_edge(matrix, 0, 0, "blue")).toBe(true);
  });

  test("Basic valid player edge check (red)", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(on_player_edge(matrix, 0, 19, "red")).toBe(true);
  });

  test("Basic valid player edge check (green)", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(on_player_edge(matrix, 19, 19, "green")).toBe(true);
  });

  test("Basic valid player edge check (yellow)", () => {
    const matrix = Array.from({ length: 20 }, () => Array(20).fill(""));
    const piece = [
      [1, 1],
      [1, 1],
    ];
    expect(on_player_edge(matrix, 19, 0, "yellow")).toBe(true);
  });
});
