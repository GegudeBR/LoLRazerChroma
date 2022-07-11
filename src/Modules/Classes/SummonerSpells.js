class SummonerSpell {
  constructor() {
    this.displayName;
    this.rawDisplayName;
  }
  update(data) {
    this.displayName = data.displayName;
    this.rawDisplayName = data.rawDisplayName;
  }
}

class SummonerSpells {
  constructor() {
    this.summonerSpellOne = new SummonerSpell();
    this.summonerSpellTwo = new SummonerSpell();
  }

  update(data) {
    this.summonerSpellOne.update(data.summonerSpellOne);
    this.summonerSpellTwo.update(data.summonerSpellTwo);
  }
}
module.exports = SummonerSpells, SummonerSpell;