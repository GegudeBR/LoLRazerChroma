const ChromaSDK = require('./src/ChromaSDK.js');
const PlayerData = require('./src/PlayerData.js');

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

let chroma = new ChromaSDK(app);
let player = new PlayerData(chroma);

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });

async function start() {
  
  try {
    
    await chroma.connect();
    await delay(10000);
    await player.levelup_animation();

    //await chroma.destruct();
    console.log('done');
  } catch (err) {
    console.error(err);
  }

};

async function stop() {
  await chroma.destruct();
  process.exit();
}

process.on('exit', async function () {
  stop();
});


process.on('SIGINT', async function () {
  stop();
});

start();
