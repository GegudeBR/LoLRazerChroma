const Abilities = require('./Abilities.js');
const ChampionStats = require('./ChampionStats.js');


class ActivePlayer {
    constructor() {
      this.Abilities = new Abilities();
      this.ChampionStats = new ChampionStats();
      this.currentGold = 0;

      this.level = 0;
      this.summonerName = "";
    }

    update(data) {
      //console.log("[INFO] ActivePlayer update()"); 
      this.Abilities.update(data.abilities);
      this.ChampionStats.update(data.ChampionStats);
      this.CurrentGold = data.CurrentGold;
      console.log(this.Abilities.Q_level);
      if (this.summonerName == "") {
        this.summonerName = data.summonerName;
      }

      this.level = data.level;
    } 
}

module.exports = ActivePlayer;