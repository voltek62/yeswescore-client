(function (Cordova, undefined) {
  var Connection = {
    types: {
      UNKNOWN: null,
      ETHERNET: null,
      WIFI: null,
      CELL_2G: null,
      CELL_3G: null,
      CELL_4G: null,
      NONE: null
    },

    initialize: function () {
      this.types.UNKNOWN = Connection.UNKNOWN;
      this.types.ETHERNET = Connection.ETHERNET;
      this.types.WIFI = Connection.WIFI;
      this.types.CELL_2G = Connection.CELL_2G;
      this.types.CELL_3G = Connection.CELL_3G;
      this.types.CELL_4G = Connection.CELL_4G;
      this.types.NONE = Connection.NONE;
    },

    getType: function () {
      return navigator.connection.type;
    },

    isOnline: function () {
      switch (this.getType()) {
        case this.types.UNKNOWN: // unknown <=> offline ?
        case this.types.NONE:
          return false;
        default:
          return true;
      }
    },

    isFast: function () {
      switch (this.getType()) {
        case this.types.ETHERNET:
        case this.types.WIFI:
          return true;
        default:
          return false;
      }
    }
  };

  Cordova.deviceready(function () {
    Cordova.Connection = Connection;
  });
})(Cordova)