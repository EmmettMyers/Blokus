from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")

# key: lobby code, value: {players, board}
game_lobbies = {}

@app.route("/test", methods=['GET'])
def test():
    return jsonify('test')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('join_game')
def handle_join_game(data):
    lobby_code = data['lobbyCode']
    player_name = data['playerName']
    if lobby_code not in game_lobbies:
        create_game_lobby(lobby_code)
    currentPlayers = game_lobbies[lobby_code]['players']
    # if lobby not full, add player to current players in lobby
    if len(currentPlayers) <= 3 and player_name not in currentPlayers:
        currentPlayers.append(player_name)
        print('Player joined game lobby: ' + str(lobby_code))
    elif len(currentPlayers) >= 4:
        print('Lobby full: ' + str(lobby_code))
        socketio.emit('lobby_full', {'lobbyCode': lobby_code})
    print(game_lobbies)

def create_game_lobby(lobby_code):
    game_lobbies[lobby_code] = {
        'players': [],
        'board': [[]]
    }
    print('New game lobby created: ' + str(lobby_code))

@socketio.on('piece_played')
def handle_piece_played(data):
    lobby_code = data['lobbyCode']
    board = data['board']
    game_lobbies[lobby_code]['board'] = board
    socketio.emit('piece_played', {'lobbyCode': lobby_code, 'board': board})
    print('Piece successfully played, lobby: ' + str(lobby_code))

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    app.run(debug=True)