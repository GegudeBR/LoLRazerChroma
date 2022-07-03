class ChampionStats {
  constructor() {
    this.abilityHaste;
    this.abilityPower;
    this.armor;
    this.armorPenetrationFlat;
    this.armorPenetrationPercent;
    this.attackDamage;
    this.attackRange;
    this.attackSpeed;
    this.bonusArmorPenetrationPercent;
    this.bonusMagicPenetrationPercent;
    this.cooldownReduction;
    this.critChance;
    this.critDamage;
    this.currentHealth;
    this.healthRegenRate;
    this.lifeSteal;
    this.magicLethality;
    this.magicPenetrationFlat;
    this.magicPenetrationPercent;
    this.magicResist;
    this.maxHealth;
    this.moveSpeed;
    this.physicalLethality;
    this.resourceMax;
    this.resourceRegenRate;
    this.resourceType;
    this.resourceValue;
    this.spellVamp;
    this.tenacity;
  }


  update(data) {
    this.abilityHaste = data.abilityHaste;
    this.abilityPower = data.abilityPower;
    this.armor = data.armor;
    this.armorPenetrationFlat = data.armorPenetrationFlat;
    this.armorPenetrationPercent = data.armorPenetrationPercent;
    this.attackDamage = data.attackDamage;
    this.attackRange = data.attackRange;
    this.attackSpeed = data.attackSpeed;
    this.bonusArmorPenetrationPercent = data.bonusArmorPenetrationPercent;
    this.bonusMagicPenetrationPercent = data.bonusMagicPenetrationPercent;
    this.cooldownReduction = data.cooldownReduction;
    this.critChance = data.critChance;
    this.critDamage = data.critDamage;
    this.currentHealth = data.currentHealth;
    this.healthRegenRate = data.healthRegenRate;
    this.lifeSteal = data.lifeSteal;
    this.magicLethality = data.magicLethality;
    this.magicPenetrationFlat = data.magicPenetrationFlat;
    this.magicPenetrationPercent = data.magicPenetrationPercent;
    this.magicResist = data.magicResist;
    this.maxHealth = data.maxHealth;
    this.moveSpeed = data.moveSpeed;
    this.physicalLethality = data.physicalLethality;
    this.resourceMax = data.resourceMax;
    this.resourceRegenRate = data.resourceRegenRate;
    this.resourceType = data.resourceType;
    this.resourceValue = data.resourceValue;
    this.spellVamp = data.spellVamp;
    this.tenacity = data.tenacity;
  }

}
module.exports = ChampionStats;