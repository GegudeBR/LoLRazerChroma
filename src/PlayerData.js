const fetch = require('cross-fetch');
const https = require('https');

class PlayerData {

  constructor(cromasdk) {
    this.chromasdk = cromasdk;
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
      this.player_health_max = response.championStats.maxHealth;
      this.player_health_current = response.championStats.currentHealth;
      this.player_resource_type = response.championStats.resourceType;
      this.player_resource_max = response.championStats.resourceMax;
      this.player_resource_current = response.championStats.resourceValue;
      this.player_health_percent = (this.player_health_current / this.player_health_max) * 100;
      this.player_resource_percent = (this.player_resource_current / this.player_resource_max) * 100;
      console.log(this.player_resource_type, this.player_resource_percent);
      this.display_chroma();
    }
    catch (error) {
      console.log("League of Legends API is not running");
    }
  }

  async display_chroma() {
    var key = new Array(6);
    for (var r = 0; r < 6; r++) {
      key[r] = new Array(22);
      for (var c = 0; c < 22; c++) {
        key[r][c] = 0;
      }
    }

    if (this.player_health_percent <= 0) { // Is dead
      for (c = 2; c < (3 + 12); c++) {
        key[1][c] = 0x01000000 | 0xff;
      }

    } else { // Player is alive
      // Set Health Bar (1-Backspace)
      for (c = 2; c < (3 + (12 * (this.player_health_percent / 100.0))); c++) {
        var green = (this.player_health_percent / 100.0) * 0xff;
        var red = 0xff - ((this.player_health_percent / 100.0) * 0xff);
        var color = (green) << 8 | red;

        key[1][c] = 0x01000000 | color;
      }

      // Set Resource Bar (F1-F12)
      for (c = 2; c < (2 + (13 * (this.player_resource_percent / 100.0))); c++) {
        if (this.player_resource_type == "MANA") {
          key[0][c] = 0x01000000 | 0xff0000;
        } else if (this.player_resource_type == "ENERGY") {
          key[0][c] = 0x01000000 | 0x00ffff;
        } else if (this.player_resource_type == "RAGE") {
          key[0][c] = 0x01000000 | 0x0000ff;
        }
      }
    }
      var color = new Array(6);
      for (r = 0; r < 6; r++) {
        color[r] = new Array(22);
        for (c = 0; c < 22; c++) {
          color[r][c] = 0;
        }
      }
    

    this.chromasdk.keyboard_effect('CHROMA_CUSTOM_KEY', {
      "key": key,
      "color": color
    });

  }

}
module.exports = PlayerData;