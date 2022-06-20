const Animation = require('./src/Animation.js');
const ChromaSDK = require('./src/ChromaSDK.js');
const Keyboard = require('./src/Keyboard.js');
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
let keyboard = new Keyboard(chroma);
let animation = new Animation(keyboard);
let player = new PlayerData(keyboard, animation);
let AnimationType = Animation.AnimationType;

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });

async function start() {
  
  try {
    
    await chroma.connect();
    await delay(5000);
    animation.add("level_up");
    await delay(1000);

    animation.add("death");
    animation.add("ally_dragon");
    //await player.death_animation();
    //await keyboard.blink(0xFF0000, 25, 5);
    //keyboard.clear_keyboard();
    //await player.ally_barron_animation();
    
    /*
    keyboard.clear_keyboard();
    player.dragon_type = "Fire";
    await player.ally_dragon_animation();
    
    player.dragon_type = "Hextech";
    await player.ally_dragon_animation();
    */

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
