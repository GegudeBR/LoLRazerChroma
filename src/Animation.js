var Enum = require('enum');

const AnimationType = new Enum ({
  ALLY_BARRON: "ally_barron",
  ALLY_DRAGON: "ally_dragon",
  LEVEL_UP: "level_up",
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
        case AnimationType.ALLY_BARRON.value:
          await this.ally_barron_animation();
          break;
        case AnimationType.ALLY_DRAGON.value:
          await this.ally_dragon_animation("Fire");
          break;
        case AnimationType.LEVEL_UP.value:
          await this.level_up_animation();
          break;
      }
      console.log("Animation done");
    }
  }

  async level_up_animation() {
    for (var i = 5; i >= 1; i--) {
      this.keyboard.key[i][1] = 0x01000000 | 0x00ffff;
      if (i == 5) {
        this.keyboard.key[i][2] = 0x01000000 | 0x00ffff;
      }
      await delay(100);
      this.keyboard.clear_keyboard();
    }
    this.keyboard.clear_keyboard();
    return;
  }

  async ally_barron_animation() {
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


  async add(animation) {
    this.queue.push(animation);
  }


  async clear() {
    this.queue = [];
  }
  

}

module.exports = Animation;