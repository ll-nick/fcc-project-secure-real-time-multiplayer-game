import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { canvasWidth, gameAreaMargin } from './constants.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const bgColor = '#222200';
const collectibleColor = '#FFFFFF'

const keyDown = { up: false, down: false, left: false, right: false };
let players = {};
let playerAvatars = {};
let collectible = {};
let thisPlayer;

function gameLoop() {
    handleMovement();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();

socket.on('newPlayer', updatedPlayers => {
    players = updatedPlayers;
    for (const id in updatedPlayers) {
        if (!playerAvatars[id]) { // Check if not already initialized
            playerAvatars[id] = new Image();
            playerAvatars[id].src = updatedPlayers[id].avatarSrc;
        }
    }
    thisPlayer = new Player(players[socket.id]);
});

socket.on('playerMoved', updatedPlayers => {
    players = updatedPlayers;
})

socket.on('newCollectible', updatedCollectible => {
    collectible = updatedCollectible;
})

function render() {
    // Background
    context.fillStyle = bgColor;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    context.font = '20px PressStart2P';
    context.fillStyle = 'white';
    context.fillText('Coin Race', canvasWidth * 0.3, 30);

    // Rank
    if (thisPlayer) {
        context.font = '12px PressStart2P';
        context.fillText(thisPlayer.calculateRank(Object.values(players)), canvasWidth * 0.7, 30);
    }

    // Players
    for (const player of Object.values(players)) {
        let canvasCoordinates = gameAreaToCanvas(player.x, player.y)
        context.drawImage(playerAvatars[player.id], canvasCoordinates.x, canvasCoordinates.y, player.width, player.height);
    }

    // Collectible
    context.fillStyle = collectibleColor;
    let canvasCoordinates = gameAreaToCanvas(collectible.x, collectible.y)
    context.fillRect(canvasCoordinates.x, canvasCoordinates.y, collectible.size, collectible.size);
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

function gameAreaToCanvas(gameAreaX, gameAreaY) {
    let convasCoordinates = {}
    convasCoordinates.x = gameAreaX + gameAreaMargin.left;
    convasCoordinates.y = gameAreaY + gameAreaMargin.top;
    return convasCoordinates;
}