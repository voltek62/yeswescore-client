(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var Push = {
    data: {
      token : null,
      platform: null
    },

    // search the token & update the player
    update: (function () {
      return function () {
	      var isCordova = true;  
	      /*#ifndef CORDOVA*/ 
	      isCordova = false; 
	      /*#endif*/  
	      if (isCordova) {
          Cordova.Push.getPushID(_.bind(function (err, token) {
            if (this.data.token !== token && token!==null && typeof token!=="undefined") {
              this.data.token = token;
              this.data.platform = window.device.platform.toLowerCase(); 
              console.log('push ok  token:'+ this.data.token+' platform:'+this.data.platform);
              this.updatePlayerInfos();
            } else {
              // erreur quelconque, on relance dans x secondes.
              console.log('push error ',err);
              setTimeout(function () { Push.update(); }, Y.Conf.get("pooling.pushregister"));
            }
          }, this));
    	  } else {
          this.data.token = "aaaa-bbbb-cccc-dddd";
          this.data.platform = "android";
          this.updatePlayerInfos();
        }
      };  
    })(),

    updatePlayerInfos: function () {
      //console.log('android debug '+this.data.token+' '+this.data.platform);
      // Update player when we receive token          
      var player = Y.User.getPlayer();
      player.set("push", { token: this.data.token, platform: this.data.platform });
      player.save();
    }
  };

  // adding some mixin for events.
  _.extend(Push, Backbone.Events);

  // pooling cordova to auto-update push token
  Y.Conf.on("ready", function () {
    var wp8 = true;
    /*#ifndef WP8*/
    wp8 = false; // false aussi en dev
    /*#endif*/

    // only once; disabled for wp8.
    if (!wp8) {
      setTimeout(function () { Push.update(); }, Y.Conf.get("pooling.pushregister"));
    }
  });
  
  // exporting to global scope
  Y.Push = Push;
})(Y);
