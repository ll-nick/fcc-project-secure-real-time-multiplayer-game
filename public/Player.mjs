import { canvasWidth, canvasHeight } from './constants.mjs';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const playerWidth = 30;
const playerHeight = 30;
class Player {
  constructor({
    x = Math.random() * (canvasWidth - playerWidth),
    y = Math.random() * (canvasHeight - playerHeight),
    score = 0,
    id = Date.now(),
    width = playerWidth,
    height = playerHeight,
    avatarSrc = '/public/avatar.png'
  }) {
    this.maxX = canvasWidth - playerWidth;
    this.maxY = canvasHeight - playerHeight;

    this.x = clamp(x, 0, this.maxX);
    this.y = clamp(y, 0, this.maxY);
    this.score = score;
    this.id = id;
    this.width = width;
    this.height = height;
    this.avatarSrc = avatarSrc;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case 'up':
        this.y = clamp(this.y - speed, 0, this.maxY);
        break;
      case 'down':
        this.y = clamp(this.y + speed, 0, this.maxY);
        break;
      case 'left':
        this.x = clamp(this.x - speed, 0, this.maxX);
        break;
      case 'right':
        this.x = clamp(this.x + speed, 0, this.maxX);
        break;
      default:
        return;
    }
  }

  collision(item) {
    if (item.x === this.x && item.y === this.y) {
      this.score += item.value;
      return true;
    }
    return false;
  }

  calculateRank(players) {
    // Sort players by score in descending order
    const sortedPlayers = players.slice().sort((a, b) => b.score - a.score);

    // Find the player's index in the sorted array
    const playerIndex = sortedPlayers.findIndex(player => player.id === this.id);

    // Calculate rank as position + 1 and total players count
    const rank = playerIndex + 1;
    const totalPlayers = sortedPlayers.length;

    // Return rank string
    return `Rank: ${rank} / ${totalPlayers}`;
  }
}

export default Player;
