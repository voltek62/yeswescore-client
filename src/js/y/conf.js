(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  // permanent storage
  var filename = "yws.json";

  var DB = new Y.DB("Y.Conf.");

  var Conf = {
    initEnv: function () {
      Y.Env.CURRENT = Y.Env.PROD; // default behaviour
      /*#ifdef DEV*/
      Y.Env.CURRENT = Y.Env.DEV;  // overloaded in dev
      /*#endif*/
      return this; // chainable
    },

    load: function (env, callback) {
      assert(env === Y.Env.DEV ||
             env === Y.Env.PROD);

      var version = "1";

      // conf already loaded => we directly return
      if (this.get("_env") === env &&
          this.get('version') === version)
        return callback();

      // Param�trage des variables dependantes d'un environnement
      switch (env) {
        case Y.Env.DEV:
          /*#ifdef DEV*/
          switch (Y.Env.user) {
            case "marc":
              var apiBaseUrl = "http://plic.no-ip.org:22222";
              var fbBaseUrl = "http://plic.no-ip.org:9091";
              var fbAppId = "618522421507840";
              break;
            case "vincent":
              var apiBaseUrl = "http://plic.no-ip.org:1024";
              var fbBaseUrl = "http://plic.no-ip.org:9090";
              var fbAppId = "408897482525651";
              break;
            case "alpha":
            default:
              var apiBaseUrl = "http://plic.no-ip.org:20080";
              var fbBaseUrl = "http://plic.no-ip.org:20081";
              var fbAppId = "FIXME";
              break;
          }

          this.set("api.url.auth", apiBaseUrl + "/v1/auth/");
          this.set("api.url.bootstrap", apiBaseUrl + "/bootstrap/conf.json?version=%VERSION%");
          this.set("api.url.facebook.login", apiBaseUrl + "/v1/facebook/login/");
          this.set("api.url.games", apiBaseUrl + "/v1/games/");
          this.set("api.url.players", apiBaseUrl + "/v1/players/");
          this.set("api.url.clubs", apiBaseUrl + "/v1/clubs/");
          this.set("api.url.stats", apiBaseUrl + "/v1/stats/");
          this.set("api.url.reports", apiBaseUrl + "/v1/report/");
          this.set("api.url.reports.games", apiBaseUrl + "/v1/report/games/");
          this.set("api.url.reports.players", apiBaseUrl + "/v1/report/players/");
          this.set("api.url.reports.clubs", apiBaseUrl + "/v1/report/clubs/");
          this.set("api.url.autocomplete.players", apiBaseUrl + "/v1/players/autocomplete/");
          this.set("api.url.autocomplete.clubs", apiBaseUrl + "/v1/clubs/autocomplete/");          
          this.set("fb.url.inappbrowser.redirect", fbBaseUrl + "/v1/inappbrowser/redirect.html");
          this.set("facebook.app.id", fbAppId);
          this.set("facebook.url.oauth", "https://www.facebook.com/dialog/oauth?%20client_id=[fb_app_id]&scope=email,publish_stream,offline_access&redirect_uri=[redirect_uri]&response_type=token");
          /*#endif*/
          break;
        case Y.Env.PROD:
          this.set("api.url.auth", "http://api.yeswescore.com/v1/auth/");
          this.set("api.url.bootstrap", "http://api.yeswescore.com/bootstrap/conf.json?version=%VERSION%");
          this.set("api.url.facebook.login", "http://api.yeswescore.com/v1/facebook/login/");
          this.set("api.url.games", "http://api.yeswescore.com/v1/games/");
          this.set("api.url.players", "http://api.yeswescore.com/v1/players/");
          this.set("api.url.clubs", "http://api.yeswescore.com/v1/clubs/");
          this.set("api.url.stats", "http://api.yeswescore.com/v1/stats/");
          this.set("api.url.reports", "http://api.yeswescore.com/v1/report/");
          this.set("api.url.reports.games", "http://api.yeswescore.com/v1/report/games/");
          this.set("api.url.reports.players", "http://api.yeswescore.com/v1/report/players/");
          this.set("api.url.reports.clubs", "http://api.yeswescore.com/v1/report/clubs/");
          this.set("api.url.autocomplete.players", "http://api.yeswescore.com/v1/players/autocomplete/");
          this.set("api.url.autocomplete.clubs", "http://api.yeswescore.com/v1/clubs/autocomplete/");
          this.set("fb.url.inappbrowser.redirect", "https://fb.yeswescore.com/v1/inappbrowser/redirect.html");
          this.set("facebook.app.id", "447718828610668");
          this.set("facebook.url.oauth", "https://www.facebook.com/dialog/oauth?%20client_id=[fb_app_id]&scope=email,publish_stream,offline_access&redirect_uri=[redirect_uri]&response_type=token");
          break;
        default:
          break;
      }

      // Param�trage des variables non d�pendantes d'un environnement
      this.set("game.refresh", 30000);        // default 30000 (30sec)
      this.set("pooling.geolocation", 10000); // default 10000 (10sec)
      this.set("pooling.connection", 1000);   // default 1000  ( 1sec)
      this.set("version", version); // will be usefull on update.
      
      //bootstrap
      //on ecrase avec les changements et on change les versions
      //variable qui oblige � mettre � jour -> objet connnection toujours offline
      //console.log('api.url.bootstrap',this.get('api.url.bootstrap').replace("%VERSION%", version));
      
      $.ajax({
          type: 'GET',
          url: this.get('api.url.bootstrap').replace("%VERSION%", version),
          success: function (infos) { 
          
            infos.forEach(function (info) {      
            
            	if (info.key.indexOf("app.deprecated")!=-1) {
            	
            		console.log('on detecte app deprecated');
            		
            		if (info.value === true) {
            			console.log('Il faut mettre � jour l\'apps');
            			Y.Connection.forceUpdate();	
            		}
            	}
                else  	
            	  Y.Conf.set(info.key, info.value);  
            	         	
            });
            
            
          },
          error: function (err) {
          
           console.log('err Connection',err);
           Y.Connection.setOff();	
          
          },
          dataType: "JSON"
        });
      

      // loading permanent keys
      //  stored inside yws.json using format [{key:...,value:...,metadata:...},...]
      Cordova.ready(function () {
        Cordova.File.read(filename, function (err, data) {
          if (err)
            return callback(); // FIXME
          var k = [];
          try { k = JSON.parse(data); } catch (e) { }
          _.forEach(k, function (o) {
            var obj = { key: o.key, value: o.value, metadata: o.metadata };
            DB.saveJSON(key, obj);
          });
          callback();
        });
      });
    },

    // Read API
    // @param string/regExp key
    // @return [values]/value/undefined
    get: function (key) {
      assert(typeof key === "string" || key instanceof RegExp);

      if (typeof key === "string") {
        var value = DB.readJSON(key);
        if (value)
          return value.value;
        return undefined;
      }
      // recursive call.
      return _.map(this.keys(key), function (key) {
        return this.get(key);
      }, this);
    },


    // Del API
    // @param string/regExp key
    // @return [values]/value/undefined
    del: function (key) {
      assert(typeof key === "string" || key instanceof RegExp);

      if (typeof key === "string") {
        return DB.remove(key);
      }

    },

    // @param string key
    // @return object/undefined
    getMetadata: function (key) {
      assert(typeof key === "string");

      var value = DB.readJSON(key);
      if (value)
        return value.metadata;
      return undefined;
    },

    // @param string key
    // @return object/undefined
    getRaw: function (key) {
      assert(typeof key === "string");

      return DB.readJSON(key);
    },

    // Write API (inspired by http://redis.io)
    set: function (key, value, metadata, callback) {
      assert(typeof key === "string");
      assert(typeof value !== "undefined");

      var obj = { key: key, value: value, metadata: metadata };
      DB.saveJSON(key, obj);

      // events
      this.trigger("set", [obj]);

      // permanent keys (cost a lot).
      if (metadata && metadata.permanent) {
        var permanentKeys = _.filter(DB.getKeys(), function (k) {
          var metadata = this.getMetadata(k);
          return metadata && metadata.permanent;
        }, this);
        var permanentObjs = _.map(permanentKeys, function (k) {
          return this.getRaw(k);
        }, this);
        // saving when cordova is ready.
        Cordova.ready(function () {
          Cordova.File.write(filename, JSON.stringify(permanentObjs), callback || function () { });
        });
      }
    },

    // set if not exist.
    setNX: function (key, value, metadata) {
      assert(typeof key === "string");

      if (!this.exist(key))
        this.set(key, value, metadata);
    },

    // search configuration keys.
    keys: function (r) {
      assert(r instanceof RegExp);

      return _.filter(DB.getKeys(), function (key) {
        return key.match(r);
      });
    },

    exist: function (key) {
      assert(typeof key === "string");

      return DB.read(key) !== null;
    },

    unload: function () {
      _.forEach(DB.getKeys(), function (key) {
        DB.remove(key);
      });
    },

    reload: function () {
      this.unload();
      this.load();
    }
  };

  // using mixin
  _.extend(Conf, Backbone.Events);

  // setting conf
  Y.Conf = Conf;
})(Y);

