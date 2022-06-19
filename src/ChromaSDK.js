const fetch = require('cross-fetch');
class CromaSDK {

  constructor(application) {
    this.application = application;
  }

  async send_heartbeat() {
    const heartbeat_response = await fetch(`${this.uri}/heartbeat`, { method: 'PUT' });
    console.log(await heartbeat_response.json());
  }

  // Create first connection
  async connect() {
    const create_response = await fetch('http://localhost:54235/razer/chromasdk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.application)
    });
    let response = await create_response.json();
    this.uri = response.uri;
    this.sessionid = response.sessionid;
    console.log(`Created Chroma at ${this.uri}`);

    this.heartbeat = setInterval(() => this.send_heartbeat(), 10000);
  }

  async keyboard_effect(effect, data, precreate = false) {
    var method_used = 'PUT';
    if (precreate) {
      method_used = 'POST';
    }

    if (!this.application.device_supported.includes('keyboard')) {
      return;
    }

    var keyboard_object;

    if (effect == "CHROMA_NONE") {
      keyboard_object = JSON.stringify({ "effect": effect });
    } else if (effect == "CHROMA_CUSTOM") {
      keyboard_object = JSON.stringify({ "effect": effect, "param": data });
    } else if (effect == "CHROMA_STATIC") {
      var color = { "color": data };
      keyboard_object = JSON.stringify({ "effect": effect, "param": color });
    } else if (effect == "CHROMA_CUSTOM_KEY") {
      keyboard_object = JSON.stringify({ "effect": effect, "param": data });
    }

    //console.log(keyboard_object);
    const keyboard_response = await fetch(`${this.uri}/keyboard`, {
      method: method_used,
      headers: {
        'Content-Type': 'application/json'
      },
      body: keyboard_object
    });
    let response = await keyboard_response.json();
    //console.log(response)
    console.log('keyboard_effect(' + effect, + ', ' + data + ', ' + precreate + ') returns ' + response.result);
    if (precreate) {
      return response.id;
    }
  }

  async set_effect(id) {
    var effect_object = JSON.stringify({ "id": id });
    const effect_response = await fetch(`${this.uri}/effect`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: effect_object
    });
    //console.log(effect_response.result);
  }

  // Detruct connection
  async destruct() {
    const delete_response = await fetch(`${this.uri}`, { method: 'DELETE' });
    clearInterval(this.heartbeat);
    return delete_response.json();
  }

}
module.exports = CromaSDK; 