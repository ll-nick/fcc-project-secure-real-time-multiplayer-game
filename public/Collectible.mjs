import { gameAreaHeight, gameAreaWidth, collectibleSize } from './constants.mjs';

class Collectible {
  constructor({
    x = Math.random() * (gameAreaWidth - collectibleSize),
    y = Math.random() * (gameAreaHeight - collectibleSize),
    value = 10,
    id = Date.now(),
    size = collectibleSize
  }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.size = size;
  }

  respawn() {
    this.x = Math.random() * (gameAreaWidth - collectibleSize)
    this.y = Math.random() * (gameAreaHeight - collectibleSize)
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch (e) { }

export default Collectible;
