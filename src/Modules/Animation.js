class Animation {
  constructor(sdk) {
    this.chroma = sdk;
    this.queue = [];
    this.current_animation = null;
  }

}
module.exports = Animation;