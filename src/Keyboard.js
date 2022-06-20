const frame_std = 20;

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });

class Keyboard {
  constructor(chromasdk) {
    this.chromasdk = chromasdk;
    this.key = new Array(6);
    this.color = new Array(6);
    this.suspend_update = false;
    for (var r = 0; r < 6; r++) {
      this.key[r] = new Array(22);
      this.color[r] = new Array(22);
    }
    this.clear_keyboard();
    this.refresh = setInterval(() => this.automatic_update(), 50);
  }

  async automatic_update() {
    if (this.suspend_update) {
      console.log("Update skipped")
      return;
    }
    await this.update();
  }

  async update() {
    // Skip update if nothing has changed
    if (this.last_key == this.key && this.last_color == this.color) {
      return
    }

    await this.chromasdk.keyboard_effect('CHROMA_CUSTOM_KEY', {
      "key": this.key,
      "color": this.color,
    });
    this.last_key =  [...this.key];
    this.last_color = [...this.color];
  }

  async set_static(color) {
    await this.chromasdk.keyboard_effect('CHROMA_STATIC', color);
  }

  async set_none() {
    await this.chromasdk.keyboard_effect('CHROMA_NONE', null);
  }

  async blink(color, duration, blink_times) {
    for(var i = 0; i < blink_times; i++) {
      await this.set_static(color);
      await delay(duration * frame_std);
      await this.set_none();
      await delay(duration * frame_std);
    } 
    return;
  }

  async background_animation(background_color, details_color, blink_times, nkeys, delay_between_blinks) {

    for(var i = 0; i < blink_times; i++) {
      for (var r = 0; r < 6; r++) {
        for (var c = 0; c < 22; c++) {
          this.key[r][c] = 0x01000000 | background_color;;
        }
      }
      for (var r = 0; r < nkeys; r++) {
        this.key[between(1, 5)][between(0, 21)] = 0x01000000 | details_color;
      }
      await this.chromasdk.keyboard_effect("CHROMA_CUSTOM_KEY", {
        "key": this.key,
        "color": this.color
      });
      await delay(delay_between_blinks * frame_std);
      this.clear_keyboard();
    }

    return;
  }

  clear_keyboard() {
    // Clear keys and colors
    for (var r = 0; r < 6; r++) {
      for (var c = 0; c < 22; c++) {
        this.key[r][c] = 0;
        this.color[r][c] = 0;
      }
    }
  }
  
}

module.exports = Keyboard;