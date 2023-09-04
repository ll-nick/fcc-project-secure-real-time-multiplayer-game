import Player from '../public/Player.mjs';
import Collectible from '../public/Collectible.mjs';
import { canvasWidth, canvasHeight } from '../public/constants.mjs';

module.exports = function (io, canvasWidth = canvasWidth, canvasHeight = canvasHeight) {
  const players = {}; // Object to store player instances

  io.on('connection', socket => {

    // Create a new player
    const newPlayer = new Player({});
    players[socket.id] = newPlayer;

    // Send player data to the client
    socket.emit('newPlayer', players);

    // Handle player movement and other interactions
    socket.on('move', data => {
      const player = players[socket.id];
      player.movePlayer(data.dirX, data.speed);
      player.movePlayer(data.dirY, data.speed);
      socket.emit('playerMoved', players)
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
      delete players[socket.id];
    });
  });
};