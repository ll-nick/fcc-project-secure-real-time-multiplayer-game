import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { gameAreaMargin, gameAreaWidth, gameAreaHeight } from './constants.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const bgColor = '#222200';
const collectibleColor = '#FFFFFF'
const titleFontSize = 18;

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
    renderBackground();
    renderHeader();
    renderFrame();
    renderPlayers();
    renderCollectible();
}

function renderBackground() {
    context.fillStyle = bgColor;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderHeader() {
    renderInstructions();
    renderTitle();
    renderRankDisplay();
}

function renderFrame() {
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.strokeRect(gameAreaMargin.left, gameAreaMargin.top, gameAreaWidth, gameAreaHeight);
}

function renderInstructions() {
    context.font = '12px PressStart2P';
    context.fillStyle = 'white';
    const instructionsText = 'Controls: WASD';
    context.fillText(instructionsText, gameAreaMargin.left, (gameAreaMargin.top + titleFontSize) / 2);
}

function renderTitle() {
    context.font = titleFontSize + 'px PressStart2P';
    context.fillStyle = 'white';

    // Calculate the width of the text to center it
    const titleText = 'Coin Race';
    const titleTextWidth = context.measureText(titleText).width;
    const titleX = gameAreaMargin.left + (canvas.width - titleTextWidth) / 2;
    context.fillText(titleText, titleX, (gameAreaMargin.top + titleFontSize) / 2);
}

function renderRankDisplay() {
    if (thisPlayer) {
        context.font = '12px PressStart2P';
        const rankText = thisPlayer.calculateRank(Object.values(players));
        const rankTextWidth = context.measureText(rankText).width;
        const rankX = canvas.width - gameAreaMargin.right - rankTextWidth;
        context.fillText(thisPlayer.calculateRank(Object.values(players)), rankX, (gameAreaMargin.top + titleFontSize) / 2);
    }
}

function renderPlayers() {
    for (const player of Object.values(players)) {
        let canvasCoordinates = gameAreaToCanvas(player.x, player.y)
        if (player.id === thisPlayer.id) {
            context.shadowColor = 'rgba(255, 215, 0, 0.5)';
            context.shadowBlur = player.width;
        }
        context.drawImage(playerAvatars[player.id], canvasCoordinates.x, canvasCoordinates.y, player.width, player.height);
        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
    }
}

function renderCollectible() {
    context.fillStyle = collectibleColor;
    const canvasCoordinates = gameAreaToCanvas(collectible.x, collectible.y)
    const collectibleRadius = collectible.size / 2; // Calculate the radius
    const collectibleX = canvasCoordinates.x + collectibleRadius; // Adjust for the center
    const collectibleY = canvasCoordinates.y + collectibleRadius; // Adjust for the center
    context.beginPath();
    context.arc(collectibleX, collectibleY, collectibleRadius, 0, Math.PI * 2);
    context.fill();
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