const fetch = require('cross-fetch');
const https = require('https');

const ActivePlayer = require('./Classes/ActivePlayer.js');

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });

class LeagueOfLegendsController {
  constructor() {
    this.ActivePlayer = new ActivePlayer();
    this.loading();
    
    this.wait_game_to_start();
  }

  async wait_game_to_start() {
    console.log("Waiting for game to start");

    while(1) {

      try {
        const request = await fetch('https://localhost:2999/liveclientdata/allgamedata', {
          method: 'GET',
          agent: new https.Agent({
            rejectUnauthorized: false
          })
        });
        if (request.status == 200) {
          break;
        }
      } catch (error) {
        // Game hasn't started yet
        console.log("Game hasn't started yet");
        await delay(1000);
      }
    }

    await this.game_started();
  }

  async game_started() {
    console.log("Game started");
    await this.update();

    this.refresh = setInterval(() => this.update(), 50);
    return;
  }

  async update() {
    try {
      const request = await fetch('https://localhost:2999/liveclientdata/allgamedata', {
        method: 'GET',
        agent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      const response = await request.json();
      this.ActivePlayer.update(response.activePlayer);
    } catch (error) {
    }
  }
}

module.exports = LeagueOfLegendsController;