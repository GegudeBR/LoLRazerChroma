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

  constructor(cromasdk) {
    this.chromasdk = cromasdk;
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
      
      this.clear_chroma_data();
      this.get_health_data();
      this.get_resource_data();
      // Display Chroma
      this.update_chroma();
      
      this.player_alive = this.is_alive();
    }
    catch (error) {
      //console.log("League of Legends API is not running");
      console.log(error);
    }
  }

  clear_chroma_data() {
    this.key = new Array(6);
    for (var r = 0; r < 6; r++) {
      this.key[r] = new Array(22);
      for (var c = 0; c < 22; c++) {
        this.key[r][c] = 0;
      }
    }

    this.color = new Array(6);
    for (r = 0; r < 6; r++) {
      this.color[r] = new Array(22);
      for (c = 0; c < 22; c++) {
        this.color[r][c] = 0;
      }
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

        this.key[1][c] = 0x01000000 | color;
      }
    } else { // Player is dead
      for (c = 2; c < (3 + 12); c++) {
        this.key[1][c] = 0x01000000 | 0xff;
      }
    }
  }

  get_resource_data() {
    if(this.is_alive()) { // Player is alive
      for (var c = 1; c < (2 + (13 * (this.player_resource_percent / 100.0))); c++) {
        if (this.player_resource_type == "MANA") {
          this.key[0][c] = 0x01000000 | 0xff0000;
        } else if (this.player_resource_type == "ENERGY") {
          this.key[0][c] = 0x01000000 | 0x00ffff;
        } else {
          this.key[0][c] = 0x01000000 | 0x0000ff;
        }
      }
    }
  }

  async background_animation(background_color, details_color) {
    this.clear_chroma_data();
    for (var r = 0; r < 6; r++) {
      for (var c = 0; c < 22; c++) {
        this.key[r][c] = 0x01000000 | background_color;;
      }
    }
    for(var r = 0; r < 15; r++) {
      this.key[between(1, 5)][between(0, 21)] = 0x01000000 | details_color;
    }
    await this.chromasdk.keyboard_effect("CHROMA_CUSTOM_KEY", {
      "key": this.key,
      "color": this.color
    });
  }

  async ally_dragon_animation() {

    var background_color;
    var details_color;
    this.dragon_type = "Water";
    if (this.dragon_type == "Hextech") { // Good colors
      background_color = 0x00ff00;
      details_color = 0xffffff;
    } else if (this.dragon_type == "Fire") { // Good colors
      background_color = 0x0000ff;
      details_color = 0x00ffff;
    } else if (this.dragon_type == "Earth") { // Can get better
      background_color = 0x003f7f;
      details_color = 0x005fbf;
    } else if (this.dragon_type == "Air") { // Can get better 
      background_color = 0xffffff;
      details_color = 0xe8e8e8;
    } else if (this.dragon_type == "Water") { // Change details color (ligher than background usually better) 
      background_color = 0xbfbf00;
      details_color = 0xbaba16;
    }

    return new Promise(async (resolve) => {
      this.playing_animation = true;
      var i = 0;
      var total_frames = 0
      var blink_duration = 200;
      // Blink twice
      for (i = 0; i <= 2 * blink_duration; i += blink_duration) {
        setTimeout(() => this.chromasdk.keyboard_effect("CHROMA_STATIC", background_color), i);
        i += blink_duration;
        setTimeout(() => this.chromasdk.keyboard_effect("CHROMA_NONE", null), i);
      }
      setTimeout(() => this.chromasdk.keyboard_effect("CHROMA_STATIC", background_color), i); // 400
      total_frames = i;

      // Background animation
      for(i = 0; i <= 1000; i+=100) {
        setTimeout(() => this.background_animation(background_color, details_color), i + total_frames);
      }
      total_frames += i;

      // Blink twice
      for (i = 0; i <= 2 * blink_duration; i += blink_duration) {
        setTimeout(() => this.chromasdk.keyboard_effect("CHROMA_STATIC", background_color), i + total_frames);
        i += blink_duration;
        setTimeout(() => this.chromasdk.keyboard_effect("CHROMA_NONE", null), i + total_frames);
      }
      total_frames += i;

      setTimeout(() => this.playing_animation = false, total_frames);
      setTimeout(() => resolve(), total_frames);
    });
  } 

  async levelup_animation() {
    this.playing_animation = true;

    for(var i = 5; i >= 1; i--) {
      this.clear_chroma_data();
      this.get_health_data();
      this.get_resource_data();
      this.key[i][1] = 0x01000000 | 0x00ffff;
      if (i == 5) {
        this.key[i][2] = 0x01000000 | 0x00ffff;
      }
      await this.chromasdk.keyboard_effect("CHROMA_CUSTOM_KEY", {
        "key": this.key,
        "color": this.color
      });
      await delay(100);
    }

    this.playing_animation = false;
  }

  async death_animation() {
    return new Promise(async (resolve) => {
      this.playing_animation = true;
      let total_frames = 500 * 2 * 10;
      // For loop to animate death
      for (var i = 0; i <= total_frames; i+=500) {
        setTimeout(() => this.chromasdk.keyboard_effect("CHROMA_STATIC", 0xff), i);
        i+=500;
        setTimeout(() => this.chromasdk.keyboard_effect("CHROMA_NONE", null), i);
      }
      setTimeout(() => this.playing_animation = false, total_frames);
      setTimeout(() => resolve(), total_frames);
    });
  }

  async update_chroma(keys, color) {

    if(this.leveled) {
      await this.levelup_animation();
    }

    if (this.is_alive() == false && this.player_alive == true) { // If player just died
      await this.death_animation();
    }
    
    if(this.playing_animation) {
      return
    }

    await this.chromasdk.keyboard_effect('CHROMA_CUSTOM_KEY', {
      "key": this.key,
      "color": this.color,
    });

  }

}
module.exports = PlayerData;