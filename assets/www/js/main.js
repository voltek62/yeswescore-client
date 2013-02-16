// Global Object
var YesWeScore = {
  lang: "fr",
  Router: null,
  Templates: null,

  load: function (callback) {
    // init router
    this.Router.initialize();
    // load the templates.
    this.Templates.loadAsync(callback);
    // start dispatching routes
    // @see http://backbonejs.org/#History-start
    Backbone.history.start();
  },

  // same as jquery ;)
  ready: (function () {
    var status = "uninitialized"; // uninitialized, loading, loaded
    var callbacks = [];

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
          // when YesWeScore is loading, we juste stack the callbacks.
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

// MAIN ENTRY POINT
$(document).ready(function () {
  // Document is ready => initializing YesWeScore
  YesWeScore.ready(function () {
    // YesWeScore is ready.
  });
});

