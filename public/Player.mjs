class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
    switch(dir) {
      case 'up':
        this.y = this.y + speed;
        break;
      case 'down':
        this.y = this.y - speed;
        break;
      case 'left':
        this.x = this.x - speed;
        break;
      case 'right':
        this.x = this.x + speed;
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
