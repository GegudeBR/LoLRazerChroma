const fetch = require('cross-fetch');
const https = require('https');

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

class PlayerData {

  constructor(cromasdk, keyboard) {
    this.chromasdk = cromasdk;
    this.keyboard = keyboard;
    this.player_alive = true;
    this.playing_animation = false;
    this.leveled = false;
    this.refresh = setInterval(() => this.update_data(), 100);
  }

  async update_data() {
     
    // Try to get player data
    try {
      const request = await fetch('https://127.0.0.1:2999/liveclientdata/activeplayer', {
        method: 'GET',
        agent: new https.Agent({
          rejectUnauthorized: false,
        })
      })
      const response = await request.json();
      this.leveled = false;
      if(this.player_level != response.level) {
        this.leveled = true;
      }
      this.player_level = response.level;
      this.player_health_max = response.championStats.maxHealth;
      this.player_health_current = response.championStats.currentHealth;
      this.player_resource_type = response.championStats.resourceType;
      this.player_resource_max = response.championStats.resourceMax;
      this.player_resource_current = response.championStats.resourceValue;
      this.player_health_percent = (this.player_health_current / this.player_health_max) * 100;
      this.player_resource_percent = (this.player_resource_current / this.player_resource_max) * 100;
      

      // Prepare data for Chroma
      
      this.keyboard.clear_keyboard();
      if (this.leveled) {
        await this.levelup_animation();
      }
      if (this.is_alive() == false && this.player_alive == true) { // If player just died
        await this.death_animation();
      }
      if(!this.keyboard.suspend_update) {
        this.get_health_data();
        this.get_resource_data();
      }
      // Display Chroma
      //this.update_chroma();
      
      this.player_alive = this.is_alive();
    }
    catch (error) {
      //console.log("League of Legends API is not running");
      //console.log(error);
    }
  }

  is_alive() {
    return this.player_health_percent > 0;
  }

  get_health_data() {
    if(this.is_alive()) { // Player is alive
      for (var c = 1; c < (3 + (12 * (this.player_health_percent / 100.0))); c++) {
        var green = (this.player_health_percent / 100.0) * 0xff;
        var red = 0xff - ((this.player_health_percent / 100.0) * 0xff);
        var color = (green) << 8 | red;

        this.keyboard.key[1][c] = 0x01000000 | color;
      }
    } else { // Player is dead
      for (c = 2; c < (3 + 12); c++) {
        this.keyboard.key[1][c] = 0x01000000 | 0xff;
      }
    }
  }

  get_resource_data() {
    if(this.is_alive()) { // Player is alive
      for (var c = 1; c < (2 + (13 * (this.player_resource_percent / 100.0))); c++) {
        if (this.player_resource_type == "MANA") {
          this.keyboard.key[0][c] = 0x01000000 | 0xff0000;
        } else if (this.player_resource_type == "ENERGY") {
          this.keyboard.key[0][c] = 0x01000000 | 0x00ffff;
        } else {
          this.keyboard.key[0][c] = 0x01000000 | 0x0000ff;
        }
      }
    }
  }

  async death_animation() {
    this.keyboard.suspend_update = true;
    await this.keyboard.blink(0xff, 10, 8);
    this.keyboard.suspend_update = false;
  }

}
module.exports = PlayerData;