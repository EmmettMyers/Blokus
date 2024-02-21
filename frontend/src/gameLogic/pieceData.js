
export const total_blocks_for_player = 89;

export const pieces_blocks_counts = [ 5, 3, 5, 5, 5, 5, 1, 4, 4, 5, 5, 4, 5, 5, 5, 5, 2, 5, 3, 4, 4 ];

export function rotate_piece(pieceIndex) {
    const piece = pieces[pieceIndex];
    const rotatedPiece = [];
    // transpose the piece
    for (let i = 0; i < piece[0].length; i++) {
        rotatedPiece.push([]);
        for (let j = piece.length - 1; j >= 0; j--) {
            rotatedPiece[i].push(piece[j][i]);
        }
    }
    pieces[pieceIndex] = rotatedPiece;
}

export function flip_piece(pieceIndex) {
    // case for matrices with odd # of rows
    if (pieceIndex.length % 2 != 0) {
        // swap first and last rows
        const temp = pieceIndex[0];
        pieceIndex[0] = pieceIndex[pieceIndex.length - 1];
        pieceIndex[pieceIndex.length - 1] = temp;
    }
    // case for matrices with even # of rows
    else {
        // loop through half of rows
        for (let i = 0; i < pieceIndex.length / 2; i++) {
            // swap first row with last, second with second-to-last, etc.
            const temp = pieceIndex[i];
            pieceIndex[i] = pieceIndex[pieceIndex.length - 1 - i];
            pieceIndex[pieceIndex.length - 1 - i] = temp;
        }
    }
}

/*
    2d subarrays of each Blokus piece
    Each piece is made up of smaller blocks
    1: block, 0: no block
*/
export let pieces = [
    [ 
        [1, 1, 1, 1, 1]
    ],
    [
        [1, 1],
        [1, 0]
    ],
    [
        [1, 1, 1, 1],
        [0, 0, 0, 1]
    ],
    [
        [1, 1, 1],
        [1, 0, 1]
    ],
    [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    [
        [1, 1, 1, 1],
        [0, 0, 1, 0]
    ],
    [
        [1, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [1],
        [1]
    ],
    [
        [0, 1],
        [1, 1],
        [1, 0],
        [1, 0]
    ],
    [
        [1, 1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ]
];

export function reset_pieces(){
    pieces = originalPieces;
}

const originalPieces = pieces.map(piece => piece.map(subPiece => subPiece.slice()));