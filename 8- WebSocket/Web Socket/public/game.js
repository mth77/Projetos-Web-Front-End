// public/game.js
const socket = io();

let playerId = null;
let isMyTurn = false;

const gameArea = document.querySelector('.game-area');
const waitingMessage = document.querySelector('.waiting-message');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resultDiv = document.querySelector('.result');
const resultMessage = document.querySelector('.result-message');
const playAgainBtn = document.querySelector('.play-again');
const player1Score = document.querySelector('.player1 span');
const player2Score = document.querySelector('.player2 span');

socket.emit('joinGame');

socket.on('gameStart', (data) => {
    playerId = socket.id;
    isMyTurn = true;
    waitingMessage.classList.add('hidden');
    gameArea.classList.remove('hidden');
    
    if (playerId === data.player1) {
        document.querySelector('.player1').textContent = 'Você: 0';
        document.querySelector('.player2').textContent = 'Oponente: 0';
    } else {
        document.querySelector('.player1').textContent = 'Oponente: 0';
        document.querySelector('.player2').textContent = 'Você: 0';
    }
});

socket.on('gameResult', (data) => {
    const myChoice = data.choices[socket.id];
    const opponentChoice = Object.values(data.choices).find(choice => choice !== myChoice);
    
    let resultText = '';
    if (data.winner === 'empate') {
        resultText = 'Empate!';
    } else if (data.winner === socket.id) {
        resultText = 'Você venceu!';
    } else {
        resultText = 'Você perdeu!';
    }
    
    resultMessage.textContent = `
        Você escolheu ${myChoice.toUpperCase()}
        Oponente escolheu ${opponentChoice.toUpperCase()}
        ${resultText}
    `;
    
    if (playerId === Object.keys(data.choices)[0]) {
        player1Score.textContent = data.scores[playerId];
        player2Score.textContent = data.scores[Object.keys(data.choices)[1]];
    } else {
        player1Score.textContent = data.scores[Object.keys(data.choices)[0]];
        player2Score.textContent = data.scores[playerId];
    }
    
    resultDiv.classList.remove('hidden');
    choiceButtons.forEach(btn => btn.disabled = true);
});

socket.on('playerDisconnected', () => {
    waitingMessage.textContent = 'Oponente desconectou. Aguardando novo jogador...';
    waitingMessage.classList.remove('hidden');
    gameArea.classList.add('hidden');
    resultDiv.classList.add('hidden');
});

choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!isMyTurn) return;
        
        const choice = button.dataset.choice;
        socket.emit('makeChoice', choice);
        choiceButtons.forEach(btn => btn.disabled = true);
        isMyTurn = false;
    });
});

playAgainBtn.addEventListener('click', () => {
    resultDiv.classList.add('hidden');
    choiceButtons.forEach(btn => btn.disabled = false);
    isMyTurn = true;
});