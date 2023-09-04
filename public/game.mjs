import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const bgColor = '#222200';
const playerColor = '#FFFFFF'

const keyDown = { up: false, down: false, left: false, right: false };
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