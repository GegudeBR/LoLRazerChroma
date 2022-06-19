const config = require('./src/config.js');
const effects = require('./src/effects.js');
const https = require('https');
const ChromaSDK = require('./src/ChromaSDK.js');

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });

async function start() {
  const app = {
    title: 'League of Legends Razer Chroma',
    description: 'Razer Chroma for League of Legends',
    author: {
      name: 'Gegude',
      contact: 'www.gegude.com'
    },
    device_supported: [
      'keyboard',
      'mouse'
    ],
    category: 'application'
  }

  try {
    let chroma = new ChromaSDK(app);
    await chroma.connect();
    await delay(10000);
    await chroma.destruct();
    console.log('done');
  } catch (err) {
    console.error(err);
  }

};

start();
