(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var Push = {
    
    data: {
      token : null,
      platform: null
    },

    update: (function () {
      var pooling = false; // avoiding pooling twice
      
      return function () {
        if (Cordova.status !== "ready" || pooling)
          return;
        pooling = true;       
	    var cordova = true;  
	    /*#ifndef CORDOVA */ 
	    cordova = false; 
	    /*#endif*/  
	    if (!cordova) {      
          Y.Push.data.token = "aaaa-bbbb-cccc-dddd";
          Y.Push.data.platform = "android";          
          Y.Push.trigger("change", Y.Push.data );

          //Update player when we receive token          
          var player = Y.User.getPlayer();
          player.save().done(function (result) {});

          return;  			
    	}
    	       
        // FIXME: treshold on "change" event ?
        Cordova.Push.getPushID(function (p) {
        if (p && Y.Push.token !== p.token ) {
          Y.Push.data.token = p.token;
          Y.Push.data.platform = window.device.platform; 
          Y.Push.trigger("change", Y.Push.data );
          
          //Update player when we receive token
          var player = Y.User.getPlayer();
          player.save().done(function (result) {});          
          
        }
        pooling = false;
      });
     };  
    })()
  };

  // adding some mixin for events.
  _.extend(Push, Backbone.Events);

  // pooling cordova to auto-update push token
  setInterval(function () { Push.update(); }, Y.Conf.get("pooling.pushregister"));
  
  // exporting to global scope
  Y.Push = Push;
})(Y);
