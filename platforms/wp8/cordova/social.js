/* MIT licensed */
// (c) 2011 Jesse MacFadyen,  Adobe Systems Incorporated
(function(window){
  var cdv = window.cordova || window.Cordova;

  // refactoring of https://github.com/phonegap/phonegap-plugins/blob/master/WindowsPhone/PGSocialShare/PGSocialShare.js
  window.plugins = window.plugins || {};
  window.plugins.social =
  {
    shareStatus: function (message, win, fail) {
      cdv.exec(win, fail, "YWSSocialShare", "shareStatus", message);
    },
    available: function () { return true } // on winPhone, share is always available.
  };
})(window);
