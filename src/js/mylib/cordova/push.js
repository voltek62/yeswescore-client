(function (Cordova, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  // wrapper around urbanairship
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
           
    },     
             
  };

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
    var push = window.pushNotification;
    push.enablePush(); 
    //push.registerEvent('registration', function(error, id) {});
  
    Cordova.Push = Push;
  });
})(Cordova);