(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var poolingId = null;

  var Connection = {
    STATUS_ONLINE: "ONLINE",
    STATUS_OFFLINE: "OFFLINE",

    status: null,
    forcedStatus: null,

    SPEED_FAST: "FAST",
    SPEED_SLOW: "SLOW",

    speed: null,

    initialize: function () {
      this.status = this.STATUS_OFFLINE;
      this.speed = this.SPEED_FAST;
    },

    isOnline: function () {
      this.update();
      return this.status === this.STATUS_ONLINE;
    },

    isFast: function () {
      return this.speed === this.SPEED_FAST;
    },

    isSlow: function () {
      return this.speed === this.SPEED_SLOW;
    },
    
    forceStatus : function (status) {  
      this.forcedStatus = status;     
    },

    resetStatus: function () {
      this.forcedStatus = undefined;
      this.update(); // forcing update.
    },
    
    setOffline : function () {
      this.status = this.STATUS_OFFLINE;
      this.trigger("change", [this.status]);
    },

    setOnline : function () {
      this.status = this.STATUS_ONLINE;
      this.trigger("change", [this.status]);
    },

    setStatus: function (status) {
      this.status = status;
      this.trigger("change", [this.status]);
    },

    setSpeed: function (speed) {
      assert(speed == this.SPEED_FAST ||
             speed == this.SPEED_SLOW);
      this.speed = speed;
    },

    update: function () {
      if (Cordova.status !== "ready")
        return;
        
      var newStatus = null;
      if (this.forcedStatus)
        newStatus = this.forcedStatus;
      else
        newStatus = Cordova.Connection.isOnline() ? this.STATUS_ONLINE : this.STATUS_OFFLINE;
      if (this.status !== newStatus) {
        this.status = newStatus;
        this.trigger("change", [newStatus]);
      }
    },

    unload: function () {
      if (poolingId) {
        clearInterval(poolingId);
        poolingId = null;
      }
    }
  };

  // adding some mixin for events.
  _.extend(Connection, Backbone.Events);

  // pooling cordova to auto-update connection status
  Y.Conf.on("ready", function () {
    poolingId = setInterval(function () { Connection.update(); }, Y.Conf.get("pooling.connection"));
  });

  // exporting to global scope
  Y.Connection = Connection;
})(Y);