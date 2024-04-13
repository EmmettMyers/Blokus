import React, { useState, useEffect } from "react";
import "./Game.css";
import Board from "../components/Board";
import PieceHolder from "../components/PieceHolder";
import { bots_playing, currentPlayerTurnIndex, player_pieces, players } from "../gameLogic/playerData";
import { reset_game } from "../gameLogic/board";
import KeyHolder from "../components/KeyHolder";
import Avatar from "../components/Avatar";
import { in_online_game } from "../gameLogic/lobbies";

function Game() {
  // timer values
  const timerLength = 59;
  const playerTime = new Date();
  playerTime.setSeconds(playerTime.getSeconds() + timerLength);

  // data for game
  const [playerNames, setPlayerNames] = useState(['blue', 'c2', 'c3', 'c4']);

  // data for current user playing
  const [myPlayer, setMyPlayer] = useState(players[currentPlayerTurnIndex]);
  const [pieceIndex, setPieceIndex] = useState(-1);
  const [userPieces, setUserPieces] = useState(player_pieces);
  const [selectedBox, setSelectedBox] = useState(-1);

  const endRound = () => {
    setPieceIndex(-1);
    setUserPieces(player_pieces);
    setSelectedBox(-1);
    setMyPlayer(players[currentPlayerTurnIndex]);
  }

  const setAvatar = (index, mode) => {
    let label = "";
    if (mode == 'local'){
      switch (index) {
        case 0: label = "blue"; break;
        case 1: label = "yellow"; break;
        case 2: label = "red"; break;
        case 3: label = "green"; break;
      }
    } else {
      switch (index) {
        case 0: bots_playing[0] = mode; break;
        case 1: bots_playing[2] = mode; break;
        case 2: bots_playing[1] = mode; break;
        case 3: bots_playing[3] = mode; break;
      }
      label = mode + " bot";
    }
    const updatedPlayerNames = [...playerNames];
    updatedPlayerNames[index] = label;
    setPlayerNames(updatedPlayerNames);
  }

  // resets old game before starting new game
  useEffect(() => {
    reset_game();
    setPlayerNames((['blue', 'c2', 'c3', 'c4']));
    endRound();
  }, []);

  return (
    <div id="game">
      <div id="boardHolder">
        <div id="avatarHolder">
          <Avatar player={playerNames[0]} index={0} setAvatar={setAvatar} />
          <Avatar player={playerNames[1]} index={1} setAvatar={setAvatar} />
        </div>
        <div id="boardOutline">
          <Board
            playerNames={playerNames}
            pieceIndex={pieceIndex}
            myPlayer={myPlayer}
            expiryTimestamp={playerTime}
            endRound={endRound}
            onlineGame={in_online_game}
          />
        </div>
        <div id="avatarHolder">
          <Avatar player={playerNames[2]} index={2} setAvatar={setAvatar} />
          <Avatar player={playerNames[3]} index={3} setAvatar={setAvatar} />
        </div>
      </div>
      <PieceHolder
        setPiece={setPieceIndex}
        userPieces={userPieces}
        myPlayer={myPlayer}
        selectedBox={selectedBox}
        setSelectedBox={setSelectedBox}
      />
      <KeyHolder />
    </div>
  );
}

export default Game;
