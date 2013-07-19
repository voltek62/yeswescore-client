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
        { quality: 50, destinationType: navigator.camera.DestinationType.DATA_URL }
      );     
    },
    
    // unused.
    getPhoto: function (callback) {  
      navigator.camera.getPicture(
        function Cordova_Camera_Success(imageData) {
          callback(null, {dataUri: imageData});
        },
        function Cordova_Camera_Error() {
          callback("unknown camera error");
        },
        //pictureSource.PHOTOLIBRARY
        //pictureSource.SAVEDPHOTOALBUM
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
       );     
     }
  };

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
    Cordova.Camera = Camera;
  });
})(Cordova);