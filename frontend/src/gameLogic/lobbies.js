import io from "socket.io-client";
import { board_matrix } from "./board";

export const socket = null;
//io("http://localhost:5000");
export let in_online_game = false;
export let lobby_code = -1;
export let player_id = Math.floor(Math.random() * 900000) + 100000;

export function set_lobby_code(value) {
  lobby_code = value;
}

export function set_in_online_game(value) {
  in_online_game = value;
}

export const create_game = () => {
  //socket.emit('create_game', {
  //    playerId: player_id
  //});
};

export const start_game = (lobbyCode) => {
  //socket.emit('start_game', {
  //    lobbyCode: lobbyCode
  //});
};

export const join_game = (lobbyCode) => {
  //socket.emit('join_game', {
  //    lobbyCode: lobbyCode,
  //    playerId: player_id
  //});
};

export const find_open_game = () => {
  //socket.emit('find_open_game', {
  //    playerId: player_id
  //});
};

export const piece_played = (lobbyCode, board) => {
  //socket.emit('piece_played', {
  //    lobbyCode: lobbyCode,
  //    board: board,
  //    playerId: player_id
  //});
};

/*
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});*/
