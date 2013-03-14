(function (Y, undefined) {
  "use strict";

  var Facebook = {
    status: "disconnected",

    isConnected: function () {
      return this.status === "connected";
    },

    connect: function () {
      // FIXME: dependance avec le player.
      var player = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
      // building facebook url.
      var facebookurl = Y.Conf.get("fb.url.login");
      facebookurl = facebookurl.replace("[token]", player.token);
      facebookurl = facebookurl.replace("[playerid]", player.id);
      // create a new browser
      var browser = new Cordova.InAppBrowser();
      browser.open(facebookurl);
    }
  };

  Y.Facebook = Facebook;
})(Y);
