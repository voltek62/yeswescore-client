(function (Y, undefined) {
  var Connection = {
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE",

    status: null,

    initialize: function () {
      this.status = this.OFFLINE;
    },

    isOnline: function () {
      this.update();
      return this.status === this.ONLINE;
    },

    update: function () {
      if (Cordova.status !== "ready")
        return;
      var newStatus = Cordova.Connection.isOnline() ? this.ONLINE : this.OFFLINE;
      if (this.status !== newStatus) {
        this.status = newStatus;
        this.trigger("change", [newStatus]);
      }
    }
  };

  // adding some mixin for events.
  _.extend(Connection, Backbone.Events);

  // pooling cordova to auto-update connection status
  setInterval(function () { Connection.update(); }, Y.Conf.get("pooling.connection"));

  // exporting to global scope
  Y.Connection = Connection;
})(Y);