const ActivePlayer = require('./ActivePlayer.js');
const GameEvents = require('./Event.js');

class GameController {
  constructor() {
    console.log("GameController initialized");
    this.ActivePlayer = new ActivePlayer();
    this.GameEvents = [];
  }

  update(data) {
    this.ActivePlayer.update(data.activePlayer);
    this.GameEvents = [];
    this.GameEvents.push(data.events.Events.map(event => new GameEvents(event)));
  }
}