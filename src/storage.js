class Storage {
  static get PLAYER_DATA_CREATED() { return 'player_data_created'; }
  static get WORLD_DATA_CREATED() { return 'world_data_created'; }

  constructor(
    worldData = {
      playersData: {},
      asteroidsData: {},
      worldBounds: [],
      relativeZonesSizes: [],
      asteroidAttractionRadiusMultiplier: 1.0,
    },
    playerData = {},
  ) {
    this.worldData = worldData;
    this.playerData = playerData;
    this._playerId = null;
    this._events = {};
  }

  updateWorldData(worldData) {
    const isCreated = Object.keys(this.worldData.playersData).length === 0
      && Object.keys(worldData).length !== 0
    ;
    // Can be moved to some kind of init event and send only once
    this.worldData.worldBounds = worldData.worldBounds;
    this.worldData.relativeZonesSizes = worldData.relativeZonesSizes;
    this.worldData.asteroidAttractionRadiusMultiplier
      = worldData.asteroidAttractionRadiusMultiplier
    ;

    // Players Data sync
    for (const key of Object.keys(worldData.playersData)) {
      if (this.worldData.playersData[key]) {
        Object.assign(this.worldData.playersData[key], worldData.playersData[key]);
      } else {
        this.worldData.playersData[key] = worldData.playersData[key];
      }
    }

    for (const key of Object.keys(this.worldData.playersData)) {
      if (!worldData.playersData[key]) {
        delete this.worldData.playersData[key];
      }
    }

    // Current player data sync
    Object.assign(this.playerData, worldData.playersData[this._playerId]);

    // Asteroids Data sync
    for (const key of Object.keys(worldData.asteroidsData)) {
      if (this.worldData.asteroidsData[key]) {
        Object.assign(this.worldData.asteroidsData[key], worldData.asteroidsData[key]);
      } else {
        this.worldData.asteroidsData[key] = worldData.asteroidsData[key];
      }
    }

    for (const key of Object.keys(this.worldData.asteroidsData)) {
      if (!worldData.asteroidsData[key]) {
        delete this.worldData.asteroidsData[key];
      }
    }

    if (isCreated) {
      this.trigger(Storage.WORLD_DATA_CREATED);
    }
  }

  updatePlayerData(playerData) {
    if (Object.keys(this.playerData).length === 0 && Object.keys(playerData).length !== 0) {
      this.trigger(Storage.PLAYER_DATA_CREATED);
    }

    Object.assign(this.playerData, playerData);
    this._playerId = playerData.id;
  }

  on(event, callback) {
    if (typeof this._events[event] === 'undefined') {
      this._events[event] = [];
    }

    this._events[event].push(callback);

    return this;
  }

  trigger(event, data) {
    if (typeof this._events[event] === 'undefined') {
      return;
    }

    for (const callback of this._events[event]) {
      callback.apply(this, data);
    }
  }
}

export default Storage;
