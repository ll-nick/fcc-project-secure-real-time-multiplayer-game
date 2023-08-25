import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const bgColor = '#222200';
const playerColor = '#FFFFFF'

const movementState = { dirX: null, dirY: null };
let players = {};

function gameLoop() {
    handleMovement();
    renderPlayers(players);
    requestAnimationFrame(gameLoop);
}

gameLoop();

socket.on('newPlayer', updatedPlayers => {
    players = updatedPlayers;
});

socket.on('playerMoved', updatedPlayers => {
    players = updatedPlayers;
})

function renderPlayers(players) {
    context.fillStyle = bgColor;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (const player of Object.values(players)) {
        let img = new Image();
        img.src = player.avatarSrc;
        console.log(img.src)
        context.drawImage(img, player.x, player.y, player.width, player.height);
    }
}

document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (key === 'w') movementState.dirY = 'up';
    if (key === 's') movementState.dirY = 'down';
    if (key === 'a') movementState.dirX = 'left';
    if (key === 'd') movementState.dirX = 'right';
});

document.addEventListener('keyup', event => {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 's') movementState.dirY = null;
    if (key === 'a' || key === 'd') movementState.dirX = null;
});

function handleMovement() {
    const speed = 10;

    socket.emit('move', { dirX: movementState.dirX, dirY: movementState.dirY, speed });
}