/* MIT licensed */
// (c) 2011 Jesse MacFadyen,  Adobe Systems Incorporated
(function(window){
  var cdv = window.cordova || window.Cordova;

  // refactoring of
  // https://github.com/phonegap/phonegap-plugins/blob/master/WindowsPhone/PGSocialShare/PGSocialShare.js
  // for cordova 2.x
  window.plugins.social =
  {
    // adding show func to mimic android / iOS social interfaces.
    show: function (msg, win, fail) {
      var options = {"message":msg, "shareType":0}; // 0 == status
      cdv.exec(win, fail, "PGSocialShare", "share", options);
    },
    available: function () { return true } // sur winPhone, il y a forcément le share natif.
  };
})(window);
