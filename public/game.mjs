import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const bgColor = '#222200';
const collectibleColor = '#FFFFFF'

const keyDown = { up: false, down: false, left: false, right: false };
let players = {};
let playerAvatars = {};
let collectible = new Collectible({});

function gameLoop() {
    handleMovement();
    render(players, collectible);
    requestAnimationFrame(gameLoop);
}

gameLoop();

socket.on('newPlayer', updatedPlayers => {
    players = updatedPlayers;
    playerAvatars[socket.id] = new Image();
    playerAvatars[socket.id].src = players[socket.id].avatarSrc;
});

socket.on('playerMoved', updatedPlayers => {
    players = updatedPlayers;
})

function render(players, collectible) {
    context.fillStyle = bgColor;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (const player of Object.values(players)) {
        context.drawImage(playerAvatars[player.id], player.x, player.y, player.width, player.height);
    }
    context.fillStyle = collectibleColor;
    context.fillRect(collectible.x, collectible.y, collectible.size, collectible.size);
}

document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (key === 'w') keyDown.up = true;
    if (key === 's') keyDown.down = true;
    if (key === 'a') keyDown.left = true;
    if (key === 'd') keyDown.right = true;
});

document.addEventListener('keyup', event => {
    const key = event.key.toLowerCase();
    if (key === 'w') keyDown.up = false;
    if (key === 's') keyDown.down = false;
    if (key === 'a') keyDown.left = false;
    if (key === 'd') keyDown.right = false;
});

function handleMovement() {
    const speed = 5;
    const dirX = keyDown.left ? 'left' :
        keyDown.right ? 'right' :
            null;
    const dirY = keyDown.up ? 'up' :
        keyDown.down ? 'down' :
            null;

    socket.emit('move', { dirX: dirX, dirY: dirY, speed });
}