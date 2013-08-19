

cordova.define("cordova/plugin/share", function (require, exports, module) {
 var exec = require("cordova/exec");
  module.exports = {
   show: function (message, win, fail) {
     exec(win, fail, "Social", "share", [message]);
   },
   share: function (message, url, image) {
     exec(null, null, "Social", "share", [message]);
   },   
   available: function (callback) {
     exec(function(avail) {callback(avail ? true : false);}, null, "Social", "available", []);
   }   
  };
});

if (!window.plugins) {
    window.plugins = {};	
}

window.plugins.social = cordova.require("cordova/plugin/share");