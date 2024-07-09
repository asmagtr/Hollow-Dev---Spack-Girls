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
//implementing the post and put requests
//to search for players to begin a new game
app.post('/search', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    arr.push(name);
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
        //responses to requests with sockets

        //search request
        io.emit('search', { allPlayers: playingArr });
    }

    res.status(200).json({ message: 'Player added to the search queue' });
});

//to update the moves during the game

//we send a makeMove request
app.put('/makeMove', (req, res) => {
    const { playerName, opponentName, index, value } = req.body;
    if (!playerName || !opponentName || index == null || !value) {
        return res.status(400).json({ error: 'Incomplete move data' });
    }

    const gameKey = playerName + '-' + opponentName;
    const reverseGameKey = opponentName + '-' + playerName;
    let gameState = gameStates[gameKey] || gameStates[reverseGameKey];

    if (gameState && gameState.board[index] === null) {
        gameState.board[index] = value;
        gameState.currentPlayer = gameState.currentPlayer.name === playerName ? { name: opponentName, value: value === 'X' ? 'O' : 'X' } : { name: playerName, value };
        
        //moveMade request
        io.emit('moveMade', { playerName, opponentName, index, value });

        let winner = checkWinner(gameState.board);
        if (winner) {
            //gameEnd request
            io.emit('gameEnd', { winner });
            delete gameStates[gameKey];
            delete gameStates[reverseGameKey];
        } else if (!gameState.board.includes(null)) {
            io.emit('gameEnd', { winner: 'Draw' });
            delete gameStates[gameKey];
            delete gameStates[reverseGameKey];
        }

        res.status(200).json({ message: 'Move made successfully' });
    } else {
        res.status(400).json({ error: 'Invalid move' });
    }
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
