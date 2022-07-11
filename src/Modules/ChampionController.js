const GlobalKeyboardListener = require('node-global-key-listener');
const fetch = require('cross-fetch');

class Champion {
  
  constructor(name) {
    this.keyboard_listener = new GlobalKeyboardListener();
    this.version_endpoint = 'https://ddragon.leagueoflegends.com/api/versions.json';
    this.champion_name = name;
    this.champion_info_endpoint = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/en_US/champion/${this.name}.json`;
    this.champion_attributes;
    await this.get_champion_info();
    

    this.keyboard_listener.addListener(function (e, down) {
      console.log(
        `${e.name} ${e.state == "DOWN" ? "DOWN" : "UP  "} [${e.rawKey._nameRaw}]`
      );
    });

  }

  async get_champion_info() {
    const version_response =  await fetch(this.version_endpoint);
    this.version = await version_response.json()[0];

    const champion_response = await fetch(this.champion_info_endpoint);
    const champion_data = await champion_response.json();

    this.champion_attributes = champion_data.data[this.champion_name];
  }

}
module.exports = Champion;