import React, { useState, useEffect } from "react";
import "./Game.css";
import Board from "../components/Board";
import PieceHolder from "../components/PieceHolder";
import { bots_playing, currentPlayerTurnIndex, player_pieces, players } from "../gameLogic/playerData";
import { reset_game } from "../gameLogic/board";
import KeyHolder from "../components/KeyHolder";
import Avatar from "../components/Avatar";
import { in_online_game, lobby_code, player_id, socket } from "../gameLogic/lobbies";

function Game() {
  // timer values
  const timerLength = 59;
  const playerTime = new Date();
  playerTime.setSeconds(playerTime.getSeconds() + timerLength);

  // data for game
  const [playerNames, setPlayerNames] = useState(['c1', 'c2', 'c3', 'c4']);

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
    if (!in_online_game){
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
    } else {
      label = player_id;
    }
    const updatedPlayerNames = [...playerNames];
    updatedPlayerNames[index] = label;
    setPlayerNames(updatedPlayerNames);
  }

  socket.on('avatar_set', ( data ) => {
    console.log('in avatar set')
    if (lobby_code === data['lobbyCode']) {
      let players = data['players'];
      const updatedPlayerNames = [...playerNames];
      for (let i = 0; i < players.length; i++){
        updatedPlayerNames[i] = players[i];
      }
      setPlayerNames(updatedPlayerNames);
    }
  });

  // resets old game before starting new game
  useEffect(() => {
    reset_game();
    if (in_online_game){
      // add new player to online game
      for (let i = 0; i < playerNames.length; i++){
        if (playerNames[i] == 'c1' || playerNames[i] == 'c2' || playerNames[i] == 'c3' || playerNames[i] == 'c4'){
          const updatedPlayerNames = [...playerNames];
          updatedPlayerNames[i] = player_id;
          setPlayerNames(updatedPlayerNames);
          break;
        }
      }
    } else {
      const updatedPlayerNames = [...playerNames];
      updatedPlayerNames[0] = 'blue';
      setPlayerNames(updatedPlayerNames);
    }
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
