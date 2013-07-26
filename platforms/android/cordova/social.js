cordova.define("cordova/plugin/share", function (require, exports, module) {
 var exec = require("cordova/exec");
  module.exports = {
   show: function (json, win, fail) {
     exec(win, fail, "Social", "share", [json]);
   },
   /*
   share: function (message, url, image) {
     exec(null, null, "Social", "share", [message]);
   },
   */   
   available: function (callback) {
   	//TODO : always true
     callback =  true;
   }   
  };
});

function Social() {
};

Social.install = function() {
    if (!window.plugins) {
        window.plugins = {};	
    }

    window.plugins.social = cordova.require("cordova/plugin/share");
    return window.plugins.social;
};

cordova.addConstructor(Social.install);