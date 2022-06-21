const fetch = require('cross-fetch');
const https = require('https');


const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });


class GameController {
  constructor(animation) {
    console.log("GameController initialized");
    this.animation = animation;
    this.events = []
    this.new_event = false;
    this.player_name = "";
    this.get_player_name();
    this.teammates = [];
    this.refresh = setInterval(() => this.update(), 50);
    
  }

  async get_player_name() {
    try {
      const request = await fetch('https://localhost:2999/liveclientdata/activeplayername', {
        method: 'GET',
        agent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      const response = await request.json();
      this.player_name = response;
      this.get_teammates();
    } catch (error) {
      //console.log(error);
      await delay(1000);
      this.get_player_name();
    }
  }

  async get_teammates() {
    try {
      const request = await fetch('https://localhost:2999/liveclientdata/playerlist', {
        method: 'GET',
        agent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      var response = await request.json();
      var team_name = "";
      // Get the team name
      for (var i = 0; i < response.length; i++) {
        if(response[i].summonerName == this.player_name) {
          team_name = response[i].team;
        }
      }
      for (var i = 0; i < response.length; i++) {
        if(response[i].team == team_name) {
          this.teammates.push(response[i].summonerName);
        }
      }
    } catch (error) {
      //console.log(error);
      await delay(1000);
      this.get_teammates();
    }
  }

  async update() {
    try {
      const request = await fetch('https://localhost:2999/liveclientdata/eventdata', {
        method: 'GET',
        agent: new https.Agent({
          rejectUnauthorized: false,
        })
      });
      const response = await request.json();
      // Check if there is a new event
      if (response.Events.length > this.events.length) {
        this.new_event = true;
      }
      this.events = response.Events;
      
      if (this.events.length == 0) {
        await this.animation.add("loading");
      }

      if (this.new_event) {
        console.log("New event");
        let event = this.events[this.events.length - 1];
        if (event.EventName == "DragonKill") { // If the last event is a dragon kill
          if(event.KillerName == this.player_name || this.teammates.includes(event.KillerName)) { // If the player or his teammates killed the dragon
            this.animation.add("ally_dragon_" + this.events[this.events.length - 1].DragonType.toLowerCase());
          }
        }
        if (event.EventName == "HeraldKill" || event.EventName == "BaronKill") { // If the last event is a herald or baron kill
          if (event.KillerName == this.player_name || this.teammates.includes(event.KillerName)) { // If the player or his teammates killed the herald or baron
            this.animation.add("ally_baron");
          }
        }

        
        this.new_event = false;
      }

    } catch (err) {
      //console.error(err);
    }
  }

}

module.exports = GameController;