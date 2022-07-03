const exec = require('child_process').exec;

const Animation = require('./src/Animation.js');
const ChromaSDK = require('./src/ChromaSDK.js');
const GameController = require('./src/GameController.js');
const Keyboard = require('./src/Keyboard.js');
const Mouse = require('./src/Mouse.js');
const PlayerData = require('./src/PlayerData.js');

const LeagueOfLegendsController = require('./src/Modules/LeagueOfLegendsController.js');
const { lookup } = require('dns');

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
let keyboard;
let mouse;
let animation;
let player;
let game;

const isRunning = (query, cb) => {
  let platform = process.platform;
  let cmd = '';
  switch (platform) {
    case 'win32': cmd = `tasklist`; break;
    case 'darwin': cmd = `ps -ax | grep ${query}`; break;
    case 'linux': cmd = `ps -A`; break;
    default: break;
  }
  exec(cmd, (err, stdout, stderr) => {
    cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
  });
}

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });

async function start() {
  
  try {
    
    await chroma.connect();
    // Wait until ChromaSDK is ready
    await delay(1000);
    keyboard = new Keyboard(chroma);
    mouse = new Mouse(chroma);
    animation = new Animation(keyboard);
    player = new PlayerData(keyboard, animation);
    game = new GameController(animation);
    await delay(5000);

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

async function loop() {
  let was_running;
  while(1) {
    isRunning('League of Legends.exe', (status) => {
      if (was_running == false && status == true) {
        // Create new game controller
        lol = new LeagueOfLegendsController();
      }

      if (was_running == true && status == false) {
        // Destroy game controller
        lol.destruct();
      }

      was_running = status;
    });
  }
}

//start();
loop();
//lol = new LeagueOfLegendsController();