class Abilities {
  constructor() {
    this.Q_id;
    this.W_id;
    this.E_id;
    this.R_id;

    this.Q_level = 0;
    this.W_level = 0;
    this.E_level = 0;
    this.R_level = 0;
  }

  update(data) {
    this.Q_id = data.Q.id;
    this.W_id = data.W.id;
    this.E_id = data.E.id;
    this.R_id = data.R.id;
    
    this.Q_level = data.Q.abilityLevel;
    this.W_level = data.W.abilityLevel;
    this.E_level = data.E.abilityLevel;
    this.R_level = data.R.abilityLevel;
   
  }

}

module.exports = Abilities;