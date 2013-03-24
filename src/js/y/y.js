// Global Object
(function (global) {
  "use strict";

  var YesWeScore = {
    lang: "fr",
    Conf: null,     // @see yws/conf.js
    Router: null,   // @see yws/router.js
    Templates: null, // @see yws/tempates.js

    status: "uninitialized",  // uninitialized, loading, loaded

    Env: {
      DEV: "DEV",
      PROD: "PROD",
      CURRENT: null
    },

    load: function (callback) {
      var that = this;
      // initializing backbone.
      Backbone.$ = $;
      // init self configuration
      this.Conf.initEnv()
               .load(this.Env.CURRENT, function onConfLoaded() {
                 // init router
                 that.Router.initialize({ hashChange: false, pushState: false });
                 // load the templates.
                 that.Templates.loadAsync(function () {
                   // start dispatching routes
                   // @see http://backbonejs.org/#History-start
                   Backbone.history.start();
                   // waiting for cordova to be ready
                   callback();
                 });
               });
    },

    // same as jquery ;)
    ready: (function () {
      var callbacks = [];

      return function ready(callback) {
        var that = this;
        switch (this.status) {
          case "uninitialized":
            // when YesWeScore is uninitialized, we just stack the callbacks.
            callbacks.push(callback);
            // we are now "loading"
            this.status = "loading";
            this.load(function () {
              // We are now ready.
              that.status = "ready";
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
  // exporting YesWeScore to global scope, aliasing it to Y.
  global.YesWeScore = YesWeScore;
  global.Y = YesWeScore;
})(this);