(function (Cordova, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  // wrapper around cordova geolocation
  var Camera = {
    
    capturePhoto: function (callback) {   

      navigator.camera.getPicture(
        function Cordova_Camera_Success(imageData) {
          if (imageData)
            callback(imageData)
          else
            callback(null);
        },
        function Cordova_Camera_Error() {
          callback(null);
        },
        /*
		Camera.DestinationType = {
		    DATA_URL : 0,                // Return image as base64 encoded string
		    FILE_URI : 1,                // Return image file URI
		    NATIVE_URI : 2               // Return image native URI (eg. assets-library:// on iOS or content:// on Android)
		};        
        */
        { quality: 50
          , targetWidth: 100
          , targetHeight: 100
          , encodingType: navigator.camera.EncodingType.JPEG
          , destinationType: navigator.camera.DestinationType.DATA_URL }
       );     
      },
      
    getPhoto: function (callback) {  
       
      navigator.camera.getPicture(
        function Cordova_Camera_Success(imageData) {
          if (imageData)
            callback(imageData)
          else
            callback(null);
        },
        function Cordova_Camera_Error() {
          callback(null);
        },
        //pictureSource.PHOTOLIBRARY
        //pictureSource.SAVEDPHOTOALBUM
        { quality: 50
          , destinationType: navigator.camera.DestinationType.FILE_URI
          , sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
       );     
      }
      
      
      
  };

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
    Cordova.Camera = Camera;
  });
})(Cordova);