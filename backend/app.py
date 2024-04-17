from flask import Flask, request, jsonify, render_template, session
from flask_socketio import SocketIO
from flask_cors import CORS
import requests
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")

# keys: lobby code, values: {players, board, startedGame}
game_lobbies = {}

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('create_game')
def handle_create_game(data):
    player_id = data['playerId']
    lobby_code = str(random.randint(0, 999999)).zfill(6)
    while lobby_code in game_lobbies:
        lobby_code = str(random.randint(0, 999999)).zfill(6)
    game_lobbies[lobby_code] = {
        'players': ["", "", "", ""],
        'board': [[]],
        'startedGame': False
    }
    socketio.emit('game_created', {'lobbyCode': lobby_code, 'playerId': player_id})

@socketio.on('start_game')
def handle_start_game(data):
    lobby_code = data['lobbyCode']
    game_lobbies[lobby_code]['startedGame'] = True
    players = game_lobbies[lobby_code]['players']
    socketio.emit('game_started', {'lobbyCode': lobby_code})
    socketio.emit('avatar_set', {'lobbyCode': lobby_code, 'players': players})

@socketio.on('join_game')
def handle_join_game(data):
    player_id = data['playerId']
    lobby_code = data['lobbyCode']
    if lobby_code not in game_lobbies:
        socketio.emit('invalid_lobby', {'playerId': player_id})
    else:
        if player_id in game_lobbies[lobby_code]['players']:
            return
        currentPlayers = game_lobbies[lobby_code]['players']
        # if lobby not full, add player to current players in lobby
        lobby_full = all(player is not "" for player in currentPlayers)
        if not lobby_full and player_id not in currentPlayers:
            empty_index = currentPlayers.index("")
            currentPlayers[empty_index] = player_id
            socketio.emit('joined_game', {'lobbyCode': lobby_code, 'playerId': player_id})
            socketio.emit('avatar_set', {'lobbyCode': lobby_code, 'players': currentPlayers})
        elif lobby_full:
            socketio.emit('lobby_full', {'lobbyCode': lobby_code, 'playerId': player_id})
        print(game_lobbies)

@socketio.on('find_open_game')
def handle_find_open_game(data):
    player_id = data['playerId']
    for lobby_code, lobby_data in game_lobbies.items():
        players = lobby_data['players']
        startedGame = lobby_data['startedGame']
        lobby_full = all(player is not "" for player in players)
        if not lobby_full and startedGame == False:
            socketio.emit('open_game_found', {'lobbyCode': lobby_code, 'playerId': player_id})
            return
    socketio.emit('no_open_game_found', {'playerId': player_id})

@socketio.on('set_avatar')
def handle_set_avatar(data):
    print("in set avatar")
    lobby_code = data['lobbyCode']
    player_id = data['playerId']
    index = data['index']
    option = data['option']
    game_lobbies[lobby_code]['players'][index] = option + ' bot'
    players = game_lobbies[lobby_code]['players']
    print(players)
    socketio.emit('avatar_set', {'lobbyCode': lobby_code, 'players': players, index: index})

@socketio.on('piece_played')
def handle_piece_played(data):
    lobby_code = data['lobbyCode']
    board = data['board']
    player_id = data['playerId']
    turn = data['turn']
    game_lobbies[lobby_code]['board'] = board
    socketio.emit('piece_played', {'lobbyCode': lobby_code, 'board': board, 'playerId': player_id, 'turn': turn})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    app.run(debug=True)