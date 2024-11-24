const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuração do Socket.IO
const rooms = new Map();

io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);

    socket.on('joinGame', () => {
        let roomId = null;
        
        for (let [id, room] of rooms.entries()) {
            if (room.players.length === 1) {
                roomId = id;
                break;
            }
        }

        if (!roomId) {
            roomId = Date.now().toString();
            rooms.set(roomId, {
                players: [],
                choices: {},
                scores: {}
            });
        }

        const room = rooms.get(roomId);
        room.players.push(socket.id);
        room.scores[socket.id] = 0;
        socket.join(roomId);
        socket.roomId = roomId;

        if (room.players.length === 2) {
            io.to(roomId).emit('gameStart', {
                player1: room.players[0],
                player2: room.players[1]
            });
        }
    });

    socket.on('makeChoice', (choice) => {
        const room = rooms.get(socket.roomId);
        if (!room) return;

        room.choices[socket.id] = choice;

        if (Object.keys(room.choices).length === 2) {
            const [player1, player2] = room.players;
            const choice1 = room.choices[player1];
            const choice2 = room.choices[player2];

            let winner = null;
            if (choice1 === choice2) {
                winner = 'empate';
            } else if (
                (choice1 === 'pedra' && choice2 === 'tesoura') ||
                (choice1 === 'tesoura' && choice2 === 'papel') ||
                (choice1 === 'papel' && choice2 === 'pedra')
            ) {
                winner = player1;
                room.scores[player1]++;
            } else {
                winner = player2;
                room.scores[player2]++;
            }

            io.to(socket.roomId).emit('gameResult', {
                choices: room.choices,
                winner,
                scores: room.scores
            });

            room.choices = {};
        }
    });

    socket.on('disconnect', () => {
        if (socket.roomId && rooms.has(socket.roomId)) {
            const room = rooms.get(socket.roomId);
            room.players = room.players.filter(id => id !== socket.id);
            if (room.players.length === 0) {
                rooms.delete(socket.roomId);
            } else {
                io.to(socket.roomId).emit('playerDisconnected');
            }
        }
    });
});

// Configuração do servidor
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});