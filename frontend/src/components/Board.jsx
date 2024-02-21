import React, { useState, useEffect } from "react";
import BoardBlock from "./BoardBlock";
import "./Board.css";
import { board_matrix, can_play_piece, play_piece } from "../gameLogic/board";
import { pieces } from "../gameLogic/pieceData";
import { currentPlayerTurnIndex, players } from "../gameLogic/playerData";

function Board({ pieceIndex }) {
  const [board, setBoard] = useState(board_matrix);
  const [displayRows, setDisplayRows] = useState([]);
  const [myPlayer, setMyPlayer] = useState(players[currentPlayerTurnIndex]);

  // creates a 20x20 grid of block components based on board 2d matrix
  const fillBoard = () => {
    let boardComponents = board.map((row, rowIndex) => (
      <div className="row" key={rowIndex}>
        {row.map((cell, colIndex) => (
          // row and column indexes are inverted because rendering is flipped
          <BoardBlock
            onClick={() => placePlayerPiece(colIndex, rowIndex)}
            onHover={() => checkIfPiecePlayable(colIndex, rowIndex)}
            onMouseLeave={() => removeHighlightsFromBoard()}
            player={
              board[colIndex][rowIndex] !== ""
                ? board[colIndex][rowIndex]
                : null
            }
            myPlayer={myPlayer}
            highlight={board[colIndex][rowIndex] == "highlight"}
          />
        ))}
      </div>
    ));
    setDisplayRows(boardComponents);
  };

  const placePlayerPiece = async (row, col) => {
    if (board[row][col] == "highlight") {
      play_piece(row, col, myPlayer, pieceIndex);
      setBoard(board_matrix);
      setMyPlayer(players[currentPlayerTurnIndex]);
    }
  };

  const setBoardHighlights = (row, col) => {
    setBoard((prevBoard) => {
      const updatedBoard = [...prevBoard];
      const piece = pieces[pieceIndex];
      for (let pieceR = 0; pieceR < piece.length; pieceR++) {
        for (let pieceC = 0; pieceC < piece[pieceR].length; pieceC++) {
          if (piece[pieceR][pieceC] === 1) {
            updatedBoard[row + pieceR][col + pieceC] = "highlight";
          }
        }
      }
      return updatedBoard;
    });
  };

  const removeHighlightsFromBoard = () => {
    const updatedBoard = board.map((row) =>
      row.map((cell) => (cell === "highlight" ? "" : cell))
    );
    setBoard(updatedBoard);
  };

  const checkIfPiecePlayable = async (row, col) => {
    // check if user selected a piece
    if (pieceIndex != -1){
      const showHighlight = can_play_piece(row, col, pieceIndex, myPlayer);
      if (showHighlight) {
        setBoardHighlights(row, col);
      }
    }
  };

  // fills board state on updates
  useEffect(() => {
    fillBoard();
  }, [board]);

  return (
    <div id="board">
      {displayRows}
    </div>
  );
}

export default Board;
