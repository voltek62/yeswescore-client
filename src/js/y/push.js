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
           
	      var isCordova = true;  
	      /*#ifndef CORDOVA */ 
	      isCordova = false; 
	      /*#endif*/  
	      if (!isCordova) {      
          Y.Push.data.token = "aaaa-bbbb-cccc-dddd";
          Y.Push.data.platform = "android";          
          Y.Push.trigger("change", Y.Push.data );

          //Update player when we receive token          
          var player = Y.User.getPlayer();
          if (player !== null)          
            player.save().done(function (result) {pooling = false;});

		      Y.Push.trigger("change", Y.Push.data);
          return;  			
    	  }
    	       
        // FIXME: treshold on "change" event ?
        Cordova.Push.getPushID(function (err, token) {
          //console.log('android token '+token+' ');        
          if (Y.Push.data.token !== token && token!==null) {
            Y.Push.data.token = token;
            Y.Push.data.platform = window.device.platform.toLowerCase(); 
            //console.log('android debug '+token+' '+window.device.platform);
          
            //Update player when we receive token
            var player = Y.User.getPlayer();
            if (player !== null)
              player.save().done(function (result) {pooling = false;});  
            Y.Push.trigger("change", Y.Push.data );
          }
          //pooling = false;
        });
      };  
    })()
  };

  // adding some mixin for events.
  _.extend(Push, Backbone.Events);

  // pooling cordova to auto-update push token
  Y.Conf.on("ready", function () {
    setInterval(function () { Push.update(); }, Y.Conf.get("pooling.pushregister"));
  });
  
  // exporting to global scope
  Y.Push = Push;
})(Y);
