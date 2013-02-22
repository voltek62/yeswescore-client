(function (Y, undefined) {
  "use strict";

  var Geolocation = {
    longitude: null,
    latitude: null,

    update: function () {
      if (Cordova.status !== "ready")
        return;
      // FIXME: treshold on "change" event ?
      Cordova.Geolocation.getCurrentPosition(function (coords) {
        if (Y.Geolocation.longitude !== coords.longitude ||
            Y.Geolocation.latitude !== coords.latitude) {
          Y.Geolocation.longitude = coords.longitude;
          Y.Geolocation.latitude = coords.latitude;
          Y.Geolocation.trigger("change", [Y.Geolocation.longitude, Y.Geolocation.latitude]);
        }
      });
    }
  };

  // adding some mixin for events.
  _.extend(Geolocation, Backbone.Events);

  // pooling cordova to auto-update geoloc coordinates
  setInterval(function () { Geolocation.update(); }, 5000);

  // exporting to global scope
  Y.Geolocation = Geolocation;
})(Y);
