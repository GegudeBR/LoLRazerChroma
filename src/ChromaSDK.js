const fetch = require('cross-fetch');
class CromaSDK {

  constructor(application) {
    this.application = application;
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

    this.heartbeat = setInterval(() => fetch(`${this.uri}/heartbeat`, { method: 'PUT' }), 10000);
  }

  // Detruct connection
  async destruct() {
    const delete_response = await fetch(`${this.uri}`, { method: 'DELETE' });
    clearInterval(this.heartbeat);
    return delete_response.json();
  }

}
module.exports = CromaSDK;