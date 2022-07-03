

class CastModes {
  constructor() {
    this.castable = true;
    this.is_normal_cast;
    this.is_instant_cast;
    this.is_point_and_click;
    // Recast
    this.has_recast;
    this.recast_mode;
  }

  uncastable() {
    this.castable = false;
  }

  normal(recast_time = -1, max_casts = 1, recast_mode = null) {
    this.is_normal_cast = true;
    this.has_recast = recast_time > 0;
    this.recast_mode = recast_time > 0 ? recast_mode ?? this.instant : null;
    this.recast_time = recast_time;
    this.max_casts = max_casts;
  }

  instant(recast_time = -1, max_casts = 1, recast_mode = null) {
    this.is_instant_cast = true;
    this.has_recast = recast_time > 0;
    this.recast_mode = recast_time > 0 ? recast_mode ?? this.instant : null;
    this.recast_time = recast_time;
    this.max_casts = max_casts;
  
  }

  is_point_and_click() {
    this.is_point_and_click = true;
    this.is_normal_cast = true;
  }

  toString() {
    return `Castable ${this.castable} Instant ${this.is_instant_cast},` + 
    `Has Recast ${this.has_recast}, Recast Mode ${this.recast_mode},` +
    `Recast Time ${this.recast_time}, Max Casts ${this.max_casts}`;
  }

}
