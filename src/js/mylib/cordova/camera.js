(function (Cordova, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  // wrapper around cordova geolocation
  var Camera = {
    capturePhoto: function (callback) {
      navigator.camera.getPicture(
        function Cordova_Camera_Success(imageData) {
          callback(null, {dataUri: imageData});
        },
        function Cordova_Camera_Error() {
          callback("unknown camera error");
        },
        { quality: 50, encodingType: navigator.camera.EncodingType.JPEG, destinationType: navigator.camera.DestinationType.DATA_URL }
      );     
    }
  };

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
    Cordova.Camera = Camera;
  });
})(Cordova);