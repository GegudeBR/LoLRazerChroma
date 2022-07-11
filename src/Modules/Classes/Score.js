class Score {
  constructor() {
    this.assists = 0;
    this.creepScore = 0;
    this.deaths = 0;
    this.kills = 0;
    this.wardScore = 0;
  }

  update(data) {
    this.assists = data.assists;
    this.creepScore = data.creepScore;
    this.deaths = data.deaths;
    this.kills = data.kills;
    this.wardScore = data.wardScore;
  }
}
module.exports = Score;