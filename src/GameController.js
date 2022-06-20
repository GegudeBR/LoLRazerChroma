const fetch = require('cross-fetch');
const https = require('https');

class GameController {
  constructor(animation) {
    console.log("GameController initialized");
    this.animation = animation;
    this.events = []
    this.new_event = false;
    this.refresh = setInterval(() => this.update(), 50);
    
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
        if (this.events[this.events.length - 1].EventName == "DragonKill") {
          this.animation.add("ally_dragon_" + this.events[this.events.length - 1].DragonType.toLowerCase());
        }

        
        this.new_event = false;
      }

    } catch (err) {
      //console.error(err);
    }
  }
}

module.exports = GameController;