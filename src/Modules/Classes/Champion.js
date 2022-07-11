const Score = require('./Score.js');
const SummonerSpells = require('./SummonerSpells');

class Champion {
  constructor() {
    this.championName;
    this.isDead;
    this.isBot;
    this.items = [];
    this.level;
    this.position;
    this.rawChampionName;
    this.respawnTimer;
    this.scores = new Score();
    this.skinID;
    this.summonerName;
    this.summonerSpells = new SummonerSpells();
    this.team;
  }

  update(data) {
    this.championName = data.championName;
    this.isDead = data.isDead;
    this.isBot = data.isBot;
    this.items = data.items;
    this.level = data.level;
    this.position = data.position;
    this.rawChampionName = data.rawChampionName;
    this.respawnTimer = data.respawnTimer;
    this.scores.update(data.scores);
    this.skinID = data.skinID;
    this.summonerName = data.summonerName;
    this.summonerSpells.update(data.summonerSpells);
    this.team = data.team;
  }
}
module.exports = Champion;