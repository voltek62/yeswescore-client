// Global Object
(function (global) {
  "use strict";

  var status = "uninitialized" // uninitialized, loading, ready
    , ondevicereadyCallbacks = []
    , onreadyCallbacks = [];

  var Cordova = {
    Geoloc: null,  // null until ready.

    initialize: function () {
      // allready loaded.
      if (status !== "uninitialized")
        return;
      // we are now "loading"
      status = "loading";
      var onDeviceReady = function () {
        // we are now "ready"
        status = "ready";
        // first => oninitialized
        _(ondevicereadyCallbacks).forEach(function (f) { f() });
        // second => onready
        _(onreadyCallbacks).forEach(function (f) { f() });
      };

      // Windows Phone 8 cordova bug.
      if (navigator.userAgent.match(/(IEMobile)/)) {
        setTimeout(function () { onDeviceReady() }, 2000);
      }
      else {
        // #BEGIN_DEV
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
          // #END_DEV
          window.addEventListener("load", function () {
            document.addEventListener("deviceready", onDeviceReady, false);
          }, false);
          // #BEGIN_DEV
        } else {
          // We cannot simulate "deviceready" event using standard API.
          // So, we trigger cordova startup on chrome browser in dev after random time < 1s
          setTimeout(function () { onDeviceReady() }, Math.round(Math.random() * 1000));
        }
        // #END_DEV
      }
    },

    deviceready: function (callback) {
      switch (status) {
        case "uninitialized":
          // when Cordova is uninitialized, we just stack the callbacks.
          ondevicereadyCallbacks.push(callback);
          break;
        case "loading":
          // when Cordova is loading, we just stack the callbacks.
          ondevicereadyCallbacks.push(callback);
          break;
        case "ready":
          // when Cordova is ready, call the callback !
          setTimeout(callback, 10);
          break;
        default:
          throw "error";
      }
    },

    // same as jquery ;)
    ready: function ready(callback) {
      switch (status) {
        case "uninitialized":
          // when Cordova is uninitialized, we just stack the callbacks.
          onreadyCallbacks.push(callback);
          break;
        case "loading":
          // when Cordova is loading, we just stack the callbacks.
          onreadyCallbacks.push(callback);
          break;
        case "ready":
          // when Cordova is ready, call the callback !
          setTimeout(callback, 10);
          break;
        default:
          throw "error";
      }
    }
  };

  // initializing on launch. (before exporting to global namespace).
  Cordova.initialize();

  // exporting Cordova to global scope
  global.Cordova = Cordova;
})(this);