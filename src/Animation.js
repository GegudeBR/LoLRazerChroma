var Enum = require('enum');

const AnimationType = new Enum ({
  ALLY_BARON: "ally_baron",
  ALLY_DRAGON_FIRE: "ally_dragon_fire",
  ALLY_DRAGON_HEXTECH: "ally_dragon_hextech",
  DEATH: "death",
  LEVEL_UP: "level_up",
  LOADING: "loading",
});

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });


class Animation {

  constructor(keyboard) {
    this.queue = [];
    this.keyboard = keyboard;
    this.refresh = setInterval(() => this.update(), 50);
  }

  async update() {
    if (this.queue.length > 0 && !this.keyboard.suspend_update) {
      const animation = this.queue.shift();
      switch (animation) {
        case AnimationType.ALLY_BARON.value:
          await this.ally_baron_animation();
          break;
        case AnimationType.ALLY_DRAGON_FIRE.value:
          await this.ally_dragon_animation("Fire");
          break;
        case AnimationType.ALLY_DRAGON_HEXTECH.value:
          await this.ally_dragon_animation("Hextech");
          break;
        case AnimationType.DEATH.value:
          await this.death_animation();
          break;
        case AnimationType.LEVEL_UP.value:
          await this.level_up_animation();
          break;
        case AnimationType.LOADING.value:
          await this.loading();
          break;
      }
      console.log("Animation done");
    }
  }

  async ally_baron_animation() {
    this.keyboard.suspend_update = true;
    await this.keyboard.blink(0xFF0000, 25, 5);
    this.keyboard.clear_keyboard();
  }

  async ally_dragon_animation(dragon_type) {

    var background_color;
    var details_color;
    // Colors in BGR format
    if (dragon_type == "Hextech") { 
      background_color = 0xff0000;
      details_color = 0xffffff;
    } else if (dragon_type == "Fire") { 
      background_color = 0x0000ff;
      details_color = 0x00ffff;
    } else if (dragon_type == "Earth") { 
      background_color = 0x003366;
      details_color = 0x001840;
    } else if (dragon_type == "Air") { 
      background_color = 0xffffff;
      details_color = 0xe8e8e8;
    } else if (dragon_type == "Water") { 
      background_color = 0x3C3C00;
      details_color = 0x28281e;
    }

    this.keyboard.suspend_update = true;
    await this.keyboard.blink(background_color, 15, 2);
    await this.keyboard.background_animation(background_color, details_color, 15, 15, 4);
    await this.keyboard.blink(background_color, 15, 2);
    this.keyboard.suspend_update = false;
  }

  async death_animation() {
    this.keyboard.suspend_update = true;
    await this.keyboard.blink(0xff, 10, 8);
    this.keyboard.suspend_update = false;
  }

  async level_up_animation() {
    for (var i = 5; i >= 1; i--) {
      this.keyboard.key[i][1] = 0x01000000 | 0x00ffff;
      if (i == 5) {
        this.keyboard.key[i][2] = 0x01000000 | 0x00ffff;
      }
      await delay(100);
      if(i == 4) {
        this.keyboard.key[i+1][2] = 0;
      } 
      this.keyboard.key[i][1] = 0;
    }
    return;
  }

  async loading() {
    this.keyboard.suspend_update = true;

    for (var i = 0; i < 22; i++) {
      this.keyboard.clear_keyboard();
      for (var j = 0; j < 6; j++) {
        this.keyboard.key[j][i] = 0x01000000 | 0xffff00;
      }
      await delay(100);
      this.keyboard.update();
    }
    await delay(500);
    for (var i = 21; i >= 0; i--) {
      this.keyboard.clear_keyboard();
      for (var j = 0; j < 6; j++) {
        this.keyboard.key[j][i] = 0x01000000 | 0xffff00;
      }
      await delay(100);
      this.keyboard.update();
    }
    this.keyboard.suspend_update = false;
    return;
  }

  async add(animation) {
    this.queue.push(animation);
  }

  async clear() {
    this.queue = [];
  }
  

}

module.exports = Animation;