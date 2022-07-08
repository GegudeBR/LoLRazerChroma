class Event {
  constructor(data) {
    this.EventID = data.EventID;
    this.EventName = data.EventName;
    this.EventTime = data.EventTime;
    this.KillerName = data.KillerName;
    this.VictimName = data.VictimName;
    this.Assisters = data.Assisters;
  }
}
module.exports = Event;