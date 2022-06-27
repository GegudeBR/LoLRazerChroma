const fetch = require('cross-fetch');

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });

const debug = false;

function print(...args) {
  if (debug) {
    console.log(...args);
  }
}

class CromaSDK {

  constructor(application) {
    this.application = application;
  }

  async send_heartbeat() {
    const heartbeat_response = await fetch(`${this.uri}/heartbeat`, { method: 'PUT' });
    print(await heartbeat_response.json());
  }

  // Create first connection
  async connect() {
    try{
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
      print(`Created Chroma at ${this.uri}`);

      this.heartbeat = setInterval(() => this.send_heartbeat(), 10000);
    } catch (err) {
      console.error(err);
      await delay(10000);
      await this.connect();
    }
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

    //print(keyboard_object);
    try {
      const keyboard_response = await fetch(`${this.uri}/keyboard`, {
        method: method_used,
        headers: {
          'Content-Type': 'application/json'
        },
        body: keyboard_object
      });
      let response = await keyboard_response.json();
      //print(response)
      print('keyboard_effect(' + effect, + ', ' + data + ', ' + precreate + ') returns ' + response.result);
      if (precreate) {
        return response.id;
      }
    } catch (error) {
      console.error(error);
    }
    return;
  }

  async mouse_effect(effect, data, precreate = false) {
    var method_used = 'PUT';
    if (precreate) {
      method_used = 'POST';
    }

    if (!this.application.device_supported.includes('mouse')) {
      return;
    }

    var mouse_object;

    if (effect == "CHROMA_NONE") {
      mouse_object = JSON.stringify({ "effect": effect });
    } else if (effect == "CHROMA_CUSTOM2") {
      mouse_object = JSON.stringify({ "effect": effect, "param": data });
    } else if (effect == "CHROMA_STATIC") {
      var color = { "color": data };
      mouse_object = JSON.stringify({ "effect": effect, "param": color });
    }

    //print(mouse_object);
    try {
      const mouse_response = await fetch(`${this.uri}/mouse`, {
        method: method_used,
        headers: {
          'Content-Type': 'application/json'
        },
        body: mouse_object
      });
      let response = await mouse_response.json();
      //print(response)
      print('mouse_effect(' + effect, + ', ' + data + ', ' + precreate + ') returns ' + response.result);
      if (precreate) {
        return response.id;
      }
    } catch (error) {
      console.error(error);
    }
    return;
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
    print(effect_response.result);
  }

  // Detruct connection
  async destruct() {
    const delete_response = await fetch(`${this.uri}`, { method: 'DELETE' });
    clearInterval(this.heartbeat);
    return delete_response.json();
  }

}
module.exports = CromaSDK; 