import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const bgColor = '#222200';
const playerColor = '#FFFFFF'

const pressedKeys = new Set();

socket.on('newPlayer', players => {
    renderPlayers(players);
});

socket.on('playerMoved', players => {
    renderPlayers(players);
})

function renderPlayers(players) {
    // Clear the canvas
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
    pressedKeys.add(key);
    handleMovement();
});

document.addEventListener('keyup', event => {
    const key = event.key.toLowerCase();
    pressedKeys.delete(key);
    handleMovement();
});

function handleMovement() {
    const speed = 10;
    let dirX = null;
    let dirY = null;

    if (pressedKeys.has('w')) dirY = 'up';
    if (pressedKeys.has('s')) dirY = 'down';
    if (pressedKeys.has('a')) dirX = 'left';
    if (pressedKeys.has('d')) dirX = 'right';

    // Send the combined movement direction to the server
    socket.emit('move', { dirX, dirY, speed });
}