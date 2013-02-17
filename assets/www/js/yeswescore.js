// Global Object
(function (global) {
  "use strict";

  var YesWeScore = {
    lang: "fr",
    Conf: null,     // @see yws/conf.js
    Router: null,   // @see yws/router.js
    Templates: null, // @see yws/tempates.js

    Env: {
      DEV: "DEV",
      PROD: "PROD",
      CURRENT: null
    },

    load: function (callback) {
      // init self configuration
      this.Conf.initEnv();
      this.Conf.load(this.Env.CURRENT);
      // init router
      this.Router.initialize();
      // load the templates.
      this.Templates.loadAsync(function () {
        // start dispatching routes
        // @see http://backbonejs.org/#History-start
        Backbone.history.start();
        // 
        callback();
      });
    },

    // same as jquery ;)
    ready: (function () {
      var status = "uninitialized"  // uninitialized, loading, loaded
        , callbacks = [];

      return function ready(callback) {
        switch (status) {
          case "uninitialized":
            // when YesWeScore is uninitialized, we just stack the callbacks.
            callbacks.push(callback);
            // we are now "loading"
            status = "loading";
            this.load(function () {
              // We are now ready.
              status = "ready";
              _(callbacks).forEach(function (f) { f() });
            });
            break;
          case "loading":
            // when YesWeScore is loading, we just stack the callbacks.
            callbacks.push(callback);
            break;
          case "ready":
            // when YesWeScore is ready, call the callback !
            setTimeout(callback, 10);
            break;
          default:
            throw "error";
        }
      };
    })()
  };
  // exporting YesWeScore to global scope
  global.YesWeScore = YesWeScore;
})(this);