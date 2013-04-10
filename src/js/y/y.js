// Global Object
(function (global) {
  "use strict";

  var YesWeScore = {
    lang: "fr",
    Conf: null,      // @see y/conf.js
    Router: null,    // @see y/router.js
    Templates: null, // @see y/tempates.js
    Views: {},       // @see y/views/*

    GUI: {
      header: null,  // singleton view #header
      content: null, // singleton current view (center)
      navbar: null   // singleton view #navbar
    },

    status: "uninitialized",  // uninitialized, loading, loaded

    Env: {
      DEV: "DEV",
      PROD: "PROD",
      CURRENT: null
    },

    load: function (callback) {
      console.log('debut load');
      var that = this;
      // initializing backbone.
      Backbone.$ = $;
      /*#ifdef CORS*/
      // forcing cors in dev environment.
      Backbone.ajax = function() {
        var args = Array.prototype.slice(arguments);
        console.log('backbone ajax overloaded : ' + JSON.stringify(args));
        if (typeof args[1] === "undefined")
          args[1] = {};
        args[1].crossDomain = true;
        try {
        return Backbone.$.ajax.apply(Backbone.$, args);
        } catch (e) {
          console.log('Exception ajax : ' +  JSON.stringify(args) + " error = " + e);
          return null;
        }
      };
      /*#endif*/
      console.log('avant conf initEnv');
      // init self configuration
      this.Conf.initEnv()
               .load(this.Env.CURRENT, function onConfLoaded() {
                 console.log('callback initEnv');
                 // init router
                 that.Router.initialize();
                 console.log('router initialized');
                 // load the templates.
                 that.Templates.loadAsync(function () {
                   console.log('template loaded');
                   // init GUI singleton
                   that.GUI.header = new Y.Views.Header();
                   that.GUI.content = null; // will be overwrite by the router.
                   that.GUI.navbar = new Y.Views.Navbar();  // unused yet.
                   console.log('backbone history start');
                   // start dispatching routes
                   // @see http://backbonejs.org/#History-start
                   Backbone.history.start();
                   // waiting for cordova to be ready
                   console.log('devrait etre ready');
                   callback();
                 });
               });
    },

    // FIXME: should be initialized only when document is ready.
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
            console.log('avant status loading ');
            this.status = "loading";
            console.log('typeof ' + typeof this.load);
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