const frame_std = 20;

const delay = ms =>
  new Promise((res, rej) => {
    setTimeout(res, ms);
  });

class Mouse {
  constructor(chromasdk) {
    this.chromasdk = chromasdk;
    this.data = new Array(9);
    this.suspend_update = false;
    for (var r = 0; r < 9; r++) {
      this.data[r] = new Array(7);
    }
    this.clear();
    this.refresh = setInterval(() => this.automatic_update(), 50);
  }

  async automatic_update() {
    if (this.suspend_update) {
      return;
    }
    await this.update();
  }

  async update() {
    // Skip update if nothing has changed
    if (this.last_data == this.data) {
      return
    }

    await this.chromasdk.mouse_effect('CHROMA_CUSTOM2', this.data);
    this.last_data =  [...this.data];
  }

  async set_static(color) {
    await this.chromasdk.mouse_effect('CHROMA_STATIC', color);
  }

  async set_none() {
    await this.chromasdk.mouse_effect('CHROMA_NONE', null);
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

  clear() {
    // Clear data
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 7; c++) {
        this.data[r][c] = 0;
      }
    }
  }
  
}

module.exports = Mouse;