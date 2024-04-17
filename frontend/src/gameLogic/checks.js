// checks if pieces can be played based on their piece index
function can_play_piece(matrix, piece, boardRow, boardCol, player){
    let has_diagonals = false;
    let on_board_edge = false;
    let all_blocks_valid = true;
    // loop through piece 2d array
    for (let r = 0; r < piece.length; r++){
        for (let c = 0; c < piece[r].length; c++ ){
            // if current block isn't empty
            if (piece[r][c] == 1){
                if (!valid_block(matrix, boardRow + r, boardCol + c, player)){
                    all_blocks_valid = false;
                    break;
                } else {
                    if (diagonals_present(matrix, boardRow + r, boardCol + c, player)){
                        has_diagonals = true;
                    } else if (on_player_edge(matrix, boardRow + r, boardCol + c, player)){
                        on_board_edge = true;
                    }
                }
            }
        }
    }
    if (all_blocks_valid && (has_diagonals || on_board_edge))
        return true;
    return false;
}

// check if the block is valid (fits within rule sets)
function valid_block(matrix, r, c, player){
    let not_past_walls = r >= 0 && r < matrix.length && c >= 0 && c < matrix[r].length;
    if (not_past_walls) {
        let block_empty = matrix[r][c] == '';
        let not_touching_own_blocks = 
            (r == matrix.length - 1 || matrix[r + 1][c] != player) && 
            (r == 0 || matrix[r - 1][c] != player) && 
            (c == matrix[0].length - 1 || matrix[r][c + 1] != player) && 
            (c == 0 || matrix[r][c - 1] != player);
        if (block_empty && not_touching_own_blocks)
            return true;
    }
    return false;
}

// check if the block has diagonal touch with correct circumstances
function diagonals_present(matrix, r, c, player){
    let top_left = 
        r > 0 && c > 0 && 
        matrix[r - 1][c - 1] == player && 
        matrix[r - 1][c] != player && 
        matrix[r][c - 1] != player;
    let bottom_left = 
        r < matrix.length - 1 && c < matrix[0].length - 1 && 
        matrix[r + 1][c + 1] == player && 
        matrix[r + 1][c] != player && 
        matrix[r][c + 1] != player;
    let top_right = 
        r > 0 && c < matrix[0].length - 1 && 
        matrix[r - 1][c + 1] == player && 
        matrix[r - 1][c] != player && 
        matrix[r][c + 1] != player;
    let bottom_right = 
        r < matrix.length - 1 && c > 0 && 
        matrix[r + 1][c - 1] == player && 
        matrix[r + 1][c] != player && 
        matrix[r][c - 1] != player;
    if (top_left || bottom_left || top_right || bottom_right)
        return true;
    return false;
}

// check if the block is on the edge the player can play on
function on_player_edge(matrix, r, c, player){
    let blue_edge = player == 'blue' && r == 0 && c == 0;
    let red_edge = player == 'red' && r == 0 && c == matrix.length - 1;
    let green_edge = player == 'green' && r == matrix.length - 1 && c == matrix.length - 1;
    let yellow_edge = player == 'yellow' && r == matrix.length - 1 && c == 0;
    if (blue_edge || red_edge || green_edge || yellow_edge)
        return true;
    return false;
}

module.exports = { 
    can_play_piece,
    valid_block,
    diagonals_present,
    on_player_edge
};