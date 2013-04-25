(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var Facebook = {
    status: "disconnected",

    isConnected: function () {
      return this.status === "connected";
    },

    connect: function () {
      // FIXME: dependance avec le player.
      var player = Y.User.getPlayer();
      // build redirect url
      var redirectUri = Y.Conf.get("fb.url.inappbrowser.redirect");
      // build facebook oauth url
      var facebookOauthUrl = Y.Conf.get("facebook.url.oauth")
                              .replace("[fb_app_id]", Y.Conf.get("facebook.app.id"))
                              .replace("[redirect_uri]", encodeURIComponent(redirectUri));
      // create a new browser
      var loadstart = function (data) { console.log('loadStart: ' + data); };
      this.browser = new Cordova.InAppBrowser();
      this.browser.open({ url: facebookOauthUrl, loadstart: loadstart });



      // https://www.facebook.com/dialog/oauth?%20client_id=408897482525651&scope=email
      //  &redirect_uri=http%3A%2F%2Fplic.no-ip.org%3A9091%2Fv1%2Finappbrowser%2Fredirect.html%3Fplayerid%3D512e0e348e2859aa5100004e%26token%3D9801580
      //  &response_type=token
    }
  };

  Y.Facebook = Facebook;
})(Y);
