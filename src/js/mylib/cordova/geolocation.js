(function (Cordova, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  // wrapper around cordova geolocation
  var Geolocation = {
    getCurrentPosition: function (callback) {
      navigator.geolocation.getCurrentPosition(
        function Cordova_Geolocation_Success(position) {
          if (position && position.coords)
            callback(null, position.coords)
          else
            callback("unknown position");
        },
        function Cordova_Geolocation_Error(err) {
          callback(err);
        }
      );
    }
  };

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
    Cordova.Geolocation = Geolocation;
  });
})(Cordova);