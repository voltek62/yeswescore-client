(function (Cordova, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  // wrapper around cordova geolocation
  var Push = {
    
    registerEvent: function (callback) {   
      
      window.pushNotification.registerEvent('registration', 
        function (id) {
		  console.log("yes!!! Registered with ID: " + id);
		  callback(id);
      	}
      );
      
      window.pushNotification.getPushID(function (id) {
        if(id) {
          console.log("Got push ID: " + id)
            //$('#id').text(id)
          }
      });
      
      window.pushNotification.enablePush();
    },
      
    pushEvent: function (callback) {   
      window.pushNotification.registerEvent('push', 
        function (push) {
		  callback(push);
      	}
      );   
    }, 
    
    isPushEnabled: function (callback) {   
      window.pushNotification.isPushEnabled(
        function (enabled) {
		  callback(enabled);
      	}
      );   
    }        
            
  };

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
    Cordova.Push = Push;
  });
})(Cordova);