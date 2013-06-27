// Global Object
(function (global, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var YesWeScore = {
    language: window.navigator.language || "en-US",
    Conf: null,      // @see y/conf.js
    Router: null,    // @see y/router.js
    Templates: null, // @see y/tempates.js
    Views: {},       // @see y/views/*

    GUI: null,       // @see y/gui.js

    App: null,       // @see y/app.js

    status: "uninitialized",  // uninitialized, loading, loaded

    /* /!\ overwrited in DEV by Y.Env in ey/env.js */
    Env: {
      DEV: "DEV",
      PROD: "PROD",
      CURRENT: null
    },

    initializingBackbone: function () {
      Backbone.$ = $;
      Backbone.ajax = function(url, options) {
          // proxy to jquery
          if (typeof url === "object") {
            options = url;
            url = undefined;
          }
          options = options || {};
          url = url || options.url;
          /*#ifdef CORS*/
          // adding cors
          options.crossDomain = true;
          /*#endif*/
          options.cache = false; // forcing jquery to add a random parameter.
          // calling jquery
          //console.log('Backbone.ajax: '+url+' '+JSON.stringify(options));
          // event system
          /*#ifdef DEV*/
          console.log('Backbone.ajax: ' + url + ' options = ' + JSON.stringify(options));
          /*#endif*/

          var that = this;
          // slow if answer is taking longer than 2sec.
          var timeoutid = window.setTimeout(function () { Y.Connection.setSpeed(Y.Connection.SPEED_SLOW); timeoutid = null; }, 2000);
          var timeoutid2 = window.setTimeout(function () {  that.trigger("request.end"); timeoutid2 = null; }, 10000);

          // delaying result (fail / success) in dev environment
          var d = $.Deferred();
          var networkDelay = 10;
          /*#ifdef DEV*/
          networkDelay = 200;
          /*#endif*/
          window.setTimeout(function () {
            // launching xhr.
            var xhr = $.ajax(url, options);
            // TRICKY: we send the event after 10ms
            //  this might be risky, because the .done() code might not be
            //  fully executed yet. But if we don't do this & there is JS exception
            //  in any done handler => this event will never be executed
            xhr.always(function () {
              setTimeout(function () { that.trigger("request.end") }, 10);
            });
            // forwarding delayed result
            xhr.done(function () {
              var args = Array.prototype.slice.apply(arguments);
              d.resolve.apply(d, args);
            });
            xhr.fail(function () {
              var args = Array.prototype.slice.apply(arguments);
              d.reject.apply(d, args);
            });
            xhr.always(function () {
              if (timeoutid) {
                window.clearTimeout(timeoutid);
                Y.Connection.setSpeed(Y.Connection.SPEED_FAST);
              }
              if (timeoutid2) {
                window.clearTimeout(timeoutid2);
              }
            });
          }, networkDelay);
          that.trigger("request.start", null, url, options); // FIXME: cannot now xhr because of delaying result.
          return d;
      };
    },

    load: function (callback) {
      var that = this;
      // forcing offline status while loading
      Y.Connection.forceStatus(Y.Connection.STATUS_OFFLINE);
      // initializing backbone.
      this.initializingBackbone();
      // init self configuration
      this.Conf.initEnv()
               .load(this.Env.CURRENT, function onConfLoaded(err) {
                 // /!\ error handling after i18n

                 // internationalization.
                 var i18nOptions = { lng: "fr-FR", fallbackLng: "fr" };
                 that.i18nOptions = i18nOptions;
                 /*#ifndef WP8*/
                 if (false) {
                 /*#endif*/
                   i18nOptions.resGetPath = '/www/locales/__lng__/translation.json';
                 /*#ifndef WP8*/
                 }
                 /*#endif*/
                 i18n.init(i18nOptions, function() {
                   // FIXME: error handling; rework the loading process.
                   //  if err is "deprecated" => we stop loading.
                   //  if err is other (ex: "network connection"), we continue to load.
                   if (err == "deprecated" || err == "network error")
                     return callback(err);

                   $("a,#offline").i18n();

                   // init router
                   that.Router.initialize();
                   /*#ifdef DEV*/
                   console.log('router initialized');
                   /*#endif*/
                   
                   // load the templates.
                   that.Templates.loadAsync(function () {
                     /*#ifdef DEV*/ 
                     console.log('template loaded');
                     /*#endif*/
                     // init GUI singleton
                     that.GUI.header = new Y.Views.Header();
                     that.GUI.content = null; // will be overwrite by the router.
                     that.GUI.autocomplete = new Y.Views.Autocomplete();
                     that.GUI.navbar = new Y.Views.Navbar();  // unused yet.
                     /*#ifdef DEV*/
                     console.log('backbone history start');
                     /*#endif*/
                     // start dispatching routes
                     // @see http://backbonejs.org/#History-start
                     Backbone.history.start();
                     // Everything is ok => updating networkg status
                     // FiXME: remplacer cet artefact de chargement par un splashscreen étendu.
                     Y.Connection.resetStatus();
                     // appel de la callback.
                     callback();
                   });
                 });
               });
    },

    unload: function () {
      Y.Connection.unload();
    },

    // FIXME: should be initialized only when document is ready.
    // same as jquery ;)
    ready: (function () {
      var callbacks = [];

      return function ready(callback) {
        switch (this.status) {
          case "uninitialized":
            // when YesWeScore is uninitialized, we just stack the callbacks.
            callbacks.push(callback);
            // we are now "loading"
            console.log('avant status loading ');
            this.status = "loading";
            console.log('typeof ' + typeof this.load);
            this.load(_.bind(function onConfLoaded(err) {
              // error handling
              if (err) {
                if (err === "deprecated") {
                  Y.Connection.forceStatus(Y.Connection.STATUS_OFFLINE);
                  Y.GUI.displayLayerNewVersion();
                  return; // we do not want to continue loading.
                }
                if (err === "network error")
                  Y.GUI.diplayLayerNetworkError();
                  return;
              }
              // We are now ready.
              this.status = "ready";
              _(callbacks).forEach(function (f) { f() });
            }, this));
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