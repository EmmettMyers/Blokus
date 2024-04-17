const {
    players,
    bots_playing,
    currentPlayerTurnIndex,
    reset_player_data,
    end_turn,
    determine_winner,
    player_pieces,
    playable_pieces,
    can_play, 
    set_turn_index
} = require('../src/gameLogic/playerData');

describe('Game functionality', () => {

    const total_blocks_for_player = 89;
    const pieces_blocks_counts = [ 1, 2, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

    test('Reset player data', () => {
        reset_player_data();
        expect(currentPlayerTurnIndex).toBe(0);
        expect(Object.keys(player_pieces)).toEqual(expect.arrayContaining(players));
        expect(Object.keys(playable_pieces)).toEqual(expect.arrayContaining(players));
        expect(can_play).toEqual({ yellow: true, red: true, blue: true, green: true });
        expect(bots_playing).toEqual(['', '', '', '']);
    });

    test('Determine winner correctly edge case', () => {
        reset_player_data();
        let player_pieces = {
            yellow: Array(21).fill(true),
            red: Array(21).fill(false),
            blue: Array(21).fill(true),
            green: Array(21).fill(true),
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected.player).toBe('red');
    });

    test('Determine winner score correctly edge case', () => {
        reset_player_data();
        let player_pieces = {
            yellow: Array(21).fill(true),
            red: Array(21).fill(false),
            blue: Array(21).fill(true),
            green: Array(21).fill(true),
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected.score).toBe(25);
    });

    test('Determine winner correctly normal case', () => {
        reset_player_data();
        let player_pieces = {
            yellow: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
            red: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, false, false, true],
            blue: [true, false, true, false, true, false, true, false, true, false, false, false, true, false, false, false, true, false, true, false, false],
            green: [true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected.player).toBe('green');
    });

    test('Determine winner score correctly normal case', () => {
        reset_player_data();
        let player_pieces = {
            yellow: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
            red: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, false, false, true],
            blue: [true, false, true, false, true, false, true, false, true, false, false, false, true, false, false, false, true, false, true, false, false],
            green: [true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected.score).toBe(-6);
    });

    test('Determine winner correctly placed all but 1', () => {
        reset_player_data();
        let player_pieces = {
            yellow: Array(21).fill(true),
            red: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            blue: Array(21).fill(true),
            green: Array(21).fill(true),
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected.player).toBe("red");
    });

    test('Determine winner correctly placed all but 1', () => {
        reset_player_data();
        let player_pieces = {
            yellow: Array(21).fill(true),
            red: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            blue: Array(21).fill(true),
            green: Array(21).fill(true),
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected.score).toBe(-1);
    });

    test('Determine winner correctly when tie of non-winners', () => {
        reset_player_data();
        let player_pieces = {
            yellow:  [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            red: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, false, false, true],
            blue: [true, false, true, false, true, false, true, false, true, false, false, false, true, false, false, false, true, false, true, false, false],
            green:[true, false, true, false, true, false, true, false, true, false, false, false, true, false, false, false, true, false, true, false, false],
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected.player).toBe("yellow");
    });

    test('Determine winner score correctly when tie of non-winners', () => {
        reset_player_data();
        let player_pieces = {
            yellow:  [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            red: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, false, false, true],
            blue: [true, false, true, false, true, false, true, false, true, false, false, false, true, false, false, false, true, false, true, false, false],
            green:[true, false, true, false, true, false, true, false, true, false, false, false, true, false, false, false, true, false, true, false, false],
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected.score).toBe(-9);
    });

    test('Determine tie check correctly when all zero', () => {
        reset_player_data();
        let player_pieces = {
            yellow: Array(21).fill(true),
            red: Array(21).fill(true),
            blue: Array(21).fill(true),
            green: Array(21).fill(true),
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected).toBe('tie');
    });

    test('Determine tie check correctly when two', () => {
        reset_player_data();
        let player_pieces = {
            yellow: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
            red: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, false, false, true],
            blue: [true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            green: [true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        }
        let expected = determine_winner(player_pieces, total_blocks_for_player, pieces_blocks_counts)
        expect(expected).toBe('tie');
    });

    test('Test setting turn index after reset', () => {
        reset_player_data();
        expect(currentPlayerTurnIndex).toBe(0);
    });

    test('Test ending current turn', () => {
        reset_player_data();
        let before_turn_index = currentPlayerTurnIndex
        let after_turn_index = end_turn();
        expect(before_turn_index).not.toBe(after_turn_index);
    });

    test('Test that after everyone takes a turn, it resets to the first player', () => {
        reset_player_data();
        let before_turn_index = currentPlayerTurnIndex
        end_turn();
        end_turn();
        end_turn();
        let after_turns_index = end_turn();
        expect(before_turn_index).toBe(after_turns_index);
    });

    test('Test that after 5 turns, it would be on the second player', () => {
        reset_player_data();
        let before_turn_index = currentPlayerTurnIndex
        end_turn();
        end_turn();
        end_turn();
        end_turn();
        let after_turns_index = end_turn();
        expect(after_turns_index).toBe(1);
    });

});