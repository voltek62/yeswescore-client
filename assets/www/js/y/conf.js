(function (Y, undefined) {
  "use strict";

  // FIXME:
  // Configuration is curently local.
  // Should be in local storage & using the bootstrap.
  var container = {};

  var Conf = {
    initEnv: function () {
      Y.Env.CURRENT = Y.Env.PROD; // default behaviour
      // #BEGIN_DEV
      // Y.Env.CURRENT = Y.Env.DEV;  // overloaded in dev
      // #END_DEV
    },

    load: function (env) {
      assert(env === undefined ||
             env === Y.Env.DEV ||
             env === Y.Env.PROD);

      // Paramétrage des variables dependantes d'un environnement
      switch (env) {
        case Y.Env.DEV:
          // #BEGIN_DEV
          this.setNX("api.url.auth", "http://91.121.184.177:1024/v1/auth/");
          this.setNX("api.url.bootstrap", "http://91.121.184.177:1024/bootstrap/conf.json?version=%VERSION%");
          this.setNX("api.url.games", "http://91.121.184.177:1024/v1/games/");
          this.setNX("api.url.players", "http://91.121.184.177:1024/v1/players/");
          this.setNX("api.url.clubs", "http://91.121.184.177:1024/v1/clubs/");
          this.setNX("package.version", "0.0.0.1");
          // #END_DEV
          break;
        case Y.Env.PROD:
          this.setNX("api.url.auth", "http://api.yeswescore.com/v1/auth/");
          this.setNX("api.url.bootstrap", "http://91.121.184.177:1024/bootstrap/conf.json?version=%VERSION%");
          this.setNX("api.url.games", "http://api.yeswescore.com/v1/games/");
          this.setNX("api.url.players", "http://api.yeswescore.com/v1/players/");
          this.setNX("api.url.clubs", "http://api.yeswescore.com/v1/clubs/");
          this.setNX("package.version", "0.0.0.1"); // versionClient
          break;
        default:
          break;
      }

      // Paramétrage des variables non dépendantes d'un environnement
      this.setNX("game.refresh", 35000); // gameRefresh
      this.setNX("cordova.file", "Y.json"); // fichier stockage des variables permanentes
      this.setNX("storage.permanent.content", ""); // fichier stockage des variables permanentes      
      this.set("updated_at", new Date()); // updated_at
    },

    // Read API
    get: function (key) {
      assert(typeof key === "string" || key instanceof RegExp);

      if (typeof key === "string") {
        if (typeof container[key] !== "undefined") {
          try {
            return JSON.parse(container[key]).value;
          } catch (e) { assert(false) }
        }
        return undefined;
      }
      // recursive call.
      return _.map(this.keys(key), function (key) {
        return this.get(key);
      }, this);
    },

    //
    getMetadata: function (key) {
      assert(typeof key === "string");

      if (typeof container[key] !== "undefined") {
        try {
          return JSON.parse(container[key]).metadata;
        } catch (e) { }
      }
      return undefined;
    },

    // Write API (inspired by http://redis.io)
    set: function (key, value, metadata) {
      assert(typeof key === "string");
      assert(typeof value !== "undefined");

      container[key] = JSON.stringify({ value: value, metadata: metadata });
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

      return _.filter(_.keys(container), function (key) {
        return key.match(r);
      });
    },

    exist: function (key) {
      assert(typeof key === "string");

      return typeof container[key] !== "undefined";
    },

    unload: function () {
      container = {};
    },

    reload: function () {
      this.unload();
      this.load();
    }
  };

  // setting conf
  Y.Conf = Conf;
})(Y);

