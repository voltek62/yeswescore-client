(function (Y, undefined) {
  "use strict";

  var Geolocation = {
    longitude: null,
    latitude: null,

    update: (function () {
      var pooling = false; // avoiding pooling twice

      return function () {
        if (Cordova.status !== "ready" || pooling)
          return;
        pooling = true;
        // FIXME: treshold on "change" event ?
        Cordova.Geolocation.getCurrentPosition(function (coords) {
          if (Y.Geolocation.longitude !== coords.longitude ||
              Y.Geolocation.latitude !== coords.latitude) {
            Y.Geolocation.longitude = coords.longitude;
            Y.Geolocation.latitude = coords.latitude;
            Y.Geolocation.trigger("change", [Y.Geolocation.longitude, Y.Geolocation.latitude]);
          }
          pooling = false;
        });
      };
    })()
  };

  // adding some mixin for events.
  _.extend(Geolocation, Backbone.Events);

  // pooling cordova to auto-update geoloc coordinates
  setInterval(function () { Geolocation.update(); }, Y.Conf.get("pooling.geolocation"));

  // exporting to global scope
  Y.Geolocation = Geolocation;
})(Y);
