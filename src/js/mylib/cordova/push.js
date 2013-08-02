(function (Cordova, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  // wrapper around cordova geolocation
  var Push = {
   
    getPushID: function (callback) { 
    
      window.pushNotification.getPushID(
        function Cordova_Push_Success(token) {
          if (token)
            callback(null, token)
          else
            callback("no token");
        },
        function Cordova_Push_Error(err) {
          callback(err);
        }      
	   );          
      window.pushNotification.enablePush();      
    },     
             
  };

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
    Cordova.Push = Push;
  });
})(Cordova);