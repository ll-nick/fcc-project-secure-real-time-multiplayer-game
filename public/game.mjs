import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const bgColor = '#222200';
const playerColor = '#FFFFFF'

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
    let dir;
    let speed = 10;

    switch (key) {
        case 'w':
            dir = 'up';
            break;
        case 's':
            dir = 'down';
            break;
        case 'a':
            dir = 'left';
            break;
        case 'd':
            dir = 'right';
            break;
        default:
            return;
    }

    // Send movement instruction to the server
    socket.emit('move', { dir, speed });
});
