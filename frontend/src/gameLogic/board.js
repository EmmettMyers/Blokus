import { players, player_pieces, playable_pieces, can_play, end_turn, determine_winner, reset_player_data, currentPlayerTurnIndex } from './playerData';
import { pieces, pieces_blocks_counts, reset_pieces, rotate_piece, total_blocks_for_player } from './pieceData';
import { can_play_piece } from './checks';

export let board_matrix = Array.from({ length: 20 }, () => Array(20).fill(''));

export function set_board_matrix(matrix){
    board_matrix = matrix;
}

export function reset_game(){
    board_matrix = Array.from({ length: 20 }, () => Array(20).fill(''));
    reset_player_data();
}

// play a piece on the board (basically performs a player's turn)
export function play_piece(boardRow, boardCol, player, piece_index){
    let piece = pieces[piece_index];
    // loop through piece 2d array
    for (let r = 0; r < piece.length; r++){
        for (let c = 0; c < piece[r].length; c++ ){
            if (piece[r][c] == 1){
                board_matrix[boardRow + r][boardCol + c] = player;
            }
        }
    }
    player_pieces[player][piece_index] = false;
    end_round_checks();
}

// plays a piece on the board randomly if player timer runs out
export function play_random_piece(player, greedySize = false, greedyCorners = false){
    // create array of all 21 piece indeces
    let indeces_array = [];
    for (let i = 20; i >= 0; i--) {
        indeces_array.push(i);
    }
    if (!greedySize){
        // randomly sort the array of indeces
        indeces_array.sort(() => Math.random() - 0.5);
    }
    while (indeces_array.length > 0){
        // get random piece index
        let piece_index = indeces_array[0];
        // if player has that piece
        if (player_pieces[player][piece_index]){
            // all possible plays with that piece (each item being a list including row, col, num rotations, and playable corners)
            let possible_piece_plays = [];
            // loop through each rotation
            for (let rotation = 0; rotation < 3; rotation++){
                // loop through board 2d array
                for (let boardRow = 0; boardRow < board_matrix.length; boardRow++) {
                    for (let boardCol = 0; boardCol < board_matrix[boardRow].length; boardCol++) {
                        // check if a piece can be played at the spot, if so add to possible plays
                        if (can_play_piece(board_matrix, pieces[piece_index], boardRow, boardCol, player)){
                            let playable_corners = find_playable_corners(piece_index, boardRow, boardCol, player);
                            possible_piece_plays.push([boardRow, boardCol, rotation, playable_corners]);
                        }
                    }
                }
                rotate_piece(piece_index);
            }
            reset_pieces();
            // if there is a possible play
            if (possible_piece_plays.length > 0){
                let selectedPlay = 0;
                if (greedyCorners){
                    // get highest possible corners play
                    let maxCorners = { index: 0, number: possible_piece_plays[0][3] };
                    for (let i = 1; i < possible_piece_plays.length; i++) {
                        if (possible_piece_plays[i][3] > maxCorners.number) {
                            maxCorners = { index: i, number: possible_piece_plays[i][3] };
                        }
                    }
                    selectedPlay = possible_piece_plays[maxCorners.index];
                } else {
                    // get random play from possible plays
                    let possiblePlaysIndex = Math.floor(Math.random() * possible_piece_plays.length);
                    selectedPlay = possible_piece_plays[possiblePlaysIndex];
                }
                let playRotations = selectedPlay[2];
                // rotate piece back to random play piece rotation
                for (let revertRotation = 0; revertRotation < playRotations; revertRotation++){
                    rotate_piece(piece_index);
                }
                play_piece(selectedPlay[0], selectedPlay[1], player, piece_index);
                reset_pieces();
                return;
            }
        }
        indeces_array.shift();
    }
}

// checks how many future plays would be available after a hypothetical move happens
function find_playable_corners(piece_index, boardRow, boardCol, player){
    let playable_corners = 0;
    // play piece on board, to be removed before end of function
    let piece = pieces[piece_index];
    for (let r = 0; r < piece.length; r++)
        for (let c = 0; c < piece[r].length; c++)
            if (piece[r][c] == 1)
                board_matrix[boardRow + r][boardCol + c] = player;
    // loop through each piece
    for (let test_piece_index = 0; test_piece_index < 21; test_piece_index++){
        // check if user has piece
        if (player_pieces[player][test_piece_index] && test_piece_index != piece_index){
            // loop through each rotation
            for (let rotation = 0; rotation < 3; rotation++){
                // loop through board copy 2d array
                for (let row = 0; row < board_matrix.length; row++) {
                    for (let col = 0; col < board_matrix[row].length; col++) {
                        // check if a piece can be played at the spot, if so add to playable corners tracker
                        if (can_play_piece(board_matrix, pieces[piece_index], row, col, player)){
                            playable_corners++;
                        }
                    }
                }
                rotate_piece(test_piece_index);
            }
            rotate_piece(test_piece_index);
        }
    }
    // remove piece from board
    for (let r = 0; r < piece.length; r++)
        for (let c = 0; c < piece[r].length; c++)
            if (piece[r][c] == 1)
                board_matrix[boardRow + r][boardCol + c] = "";
    return playable_corners;
}

// checks to do after every round
function end_round_checks(){
    set_player_game_overs();
    //console.log("current player -> " + players[currentPlayerTurnIndex] + ": " + can_play[players[currentPlayerTurnIndex]] + ", " + playable_pieces[players[currentPlayerTurnIndex]])
    if (is_game_over()){
        console.log("game over");
        console.log("winner: " + determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts).player);
    } else {
        end_turn();
        reset_pieces();
    }
}

// check if game is over (no one can play any pieces)
function is_game_over(){
    if (!can_play['yellow'] && !can_play['red'] && !can_play['blue'] && !can_play['green'])
        return true;
    return false;
}

// check if the game is over for players
function set_player_game_overs() {
    // loop through players
    players.forEach((player) => {
        let player_can_play = false;
        // loop through pieces
        for (let piece_index = 0; piece_index < pieces.length; piece_index++){
            let piece_was_playable = false;
            // check if player has piece
            if (player_pieces[player][piece_index]){
                // loop through each rotation
                for (let rotation = 0; rotation < 3; rotation++){
                    // loop through board_matrix
                    for (let row = 0; row < board_matrix.length; row++) {
                        for (let col = 0; col < board_matrix[row].length; col++) {
                            // which pieces can the player play, if any at all?
                            if (player_pieces[player] && can_play_piece(board_matrix, pieces[piece_index], row, col, player)){
                                player_can_play = true;
                                piece_was_playable = true;
                            }
                        }
                    }
                    rotate_piece(piece_index);
                }
                reset_pieces();
            }
            playable_pieces[player][piece_index] = piece_was_playable;
        }
        // sets if the player can play any pieces
        can_play[player] = player_can_play;
    });
}