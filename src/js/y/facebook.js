(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var Facebook = {
    _connecting: false,

    isConnected: function () {
      var player = Y.User.getPlayer();
      return player.get('connection') &&
             player.get('connection').facebook &&
             player.get('connection').facebook.token;
    },

    shareAsync: function (callback) {
      var share = function (err) {
        if (err) { return callback(err); }
        // using fb graph api
        var player = Y.User.getPlayer();
        //
        var fbid = player.get('connection').facebook.id;
        var fbtoken = player.get('connection').facebook.token;
        $.ajax({
          type: 'POST',
          url: "https://graph.facebook.com/" + fbid + "/feed",
          data: {message: "W00t", target_id: fbid, access_token: fbtoken, format: "json"},
          success: function (data) { 
            console.log("SHARED : " + data);
            callback(null);
          },
          error: function (jqXHR, satus, error) { callback(error); },
          dataType: "JSON"
        });
      };
      if (this.isConnected())
        share();
      else
        this.connectAsync(share);
    },

    connectAsync: function (callback) {
      if (this._connecting)
        return;
      var that = this;
      this._connecting = true;
      // FIXME: dependance avec le player.
      var player = Y.User.getPlayer();
      // build redirect url
      var redirectUri = Y.Conf.get("fb.url.inappbrowser.redirect");
      // build facebook oauth url
      var facebookOauthUrl = Y.Conf.get("facebook.url.oauth")
                              .replace("[fb_app_id]", Y.Conf.get("facebook.app.id"))
                              .replace("[redirect_uri]", encodeURIComponent(redirectUri));
      // create a new browser
      var loadstart = function (data) {
        // FIXME some limitations here ?
        var url = data.url;
        // inappbrowser destination regex url
        // FIXME: weak regex, we should use an url parser.
        // YOUR_REDIRECT_URI#access_token=USER_ACCESS_TOKEN&expires_in=NUMBER_OF_SECONDS_UNTIL_TOKEN_EXPIRES
        var success = /.*\/v1\/inappbrowser\/redirect.html\#.*access_token\=(.+)\&.*/;
        // YOUR_REDIRECT_URI?error_reason=user_denied&error=access_denied&error_description=The+user+denied+your+request.
        var error = /.*\/v1\/inappbrowser\/redirect.html.*error_description\=(.+).*/;
        var successed = success.exec(url);
        if (successed && typeof successed[1] === "string") {
          // now we have the token, request the API.
          var token = successed[1];
          // saving token to api.
          var player = Y.User.getPlayer();
          var playerId = player.get('id');
          var playerToken = player.get('token');
          //
          Backbone.ajax({
            dataType : 'json',
            url : Y.Conf.get("api.url.facebook.login"),
            type : 'GET',
            data : { playerid: playerId, token: playerToken, access_token: token },
            success : function(data) {
              if (data &&
                  data.id == playerId &&
                  data.token == playerToken &&
                  data.connection && data.connection.facebook &&
                  data.connection.facebook.token) {
                console.log('everything seems ok');
                // update du player
                // checker si pas de perte de token, etc.
                player.set(data);
                that._connecting = false;
                callback(null); // success
                return;
              }
              that._connecting = false;
              callback("api error");
            }
          });

        } else if (error.exec(url)) {
          that._connecting = false;
          callback("fb error");
        }
        
      };
      this.browser = new Cordova.InAppBrowser();
      this.browser.open({ url: facebookOauthUrl, loadstart: loadstart });

      // https://www.facebook.com/dialog/oauth?%20client_id=408897482525651&scope=email
      //  &redirect_uri=http%3A%2F%2Fplic.no-ip.org%3A9091%2Fv1%2Finappbrowser%2Fredirect.html%3Fplayerid%3D512e0e348e2859aa5100004e%26token%3D9801580
      //  &response_type=token
    }
  };

  Y.Facebook = Facebook;
})(Y);
