const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

let arr = [];
let playingArr = [];
let gameStates = {};

app.use(express.static(path.resolve('')));
app.use(express.json());

io.on('connect', (socket) => {
    socket.on('search', (tmp) => {
        if (!tmp.e) {
            arr.push(tmp.name);
            if (arr.length >= 2) {
                let firstPlayer = {
                    name: arr[0],
                    value: "X"
                };
                let secondPlayer = {
                    name: arr[1],
                    value: "O"
                };

                let players = {
                    firstPlayer,
                    secondPlayer
                };
                playingArr.push(players);
                arr.splice(0, 2);
                gameStates[players.firstPlayer.name + '-' + players.secondPlayer.name] = {
                    board: Array(9).fill(null),
                    currentPlayer: firstPlayer
                };
                io.emit('search', { allPlayers: playingArr });
            }
        }
    });

    socket.on('makeMove', ({ playerName, opponentName, index, value }) => {
        const gameKey = playerName + '-' + opponentName;
        const reverseGameKey = opponentName + '-' + playerName;
        let gameState = gameStates[gameKey] || gameStates[reverseGameKey];

        if (gameState && gameState.board[index] === null) {
            gameState.board[index] = value;
            gameState.currentPlayer = gameState.currentPlayer.name === playerName ? { name: opponentName, value: value === 'X' ? 'O' : 'X' } : { name: playerName, value };
            io.emit('moveMade', { playerName, opponentName, index, value });

            let winner = checkWinner(gameState.board);
            if (winner) {
                io.emit('gameEnd', { winner });
                delete gameStates[gameKey];
                delete gameStates[reverseGameKey];
            } else if (!gameState.board.includes(null)) {
                io.emit('gameEnd', { winner: 'Draw' });
                delete gameStates[gameKey];
                delete gameStates[reverseGameKey];
            }
        }
    });
});

app.get('/', (req, res) => {
    return res.sendFile("index.html");
});

server.listen(3000, () => {
    console.log('port connected to 3000');
});

function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}
