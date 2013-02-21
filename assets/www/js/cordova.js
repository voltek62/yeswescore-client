// Global Object
(function (global) {
  "use strict";

  var Cordova = {
    Geoloc: null,  // null until ready.

    // same as jquery ;)
    ready: (function () {
      var status = "uninitialized" // uninitialized, loading, loaded
        , callbacks = [];

      return function ready(callback) {
        switch (status) {
          case "uninitialized":
            // when Cordova is uninitialized, we just stack the callbacks.
            callbacks.push(callback);
            // we are now "loading"
            status = "loading";
            var onDeviceReady = function () {
              console.log('event: deviceready');
              // we are now "ready"
              status = "ready";
              _(callbacks).forEach(function (f) { f() });
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
                  console.log('window loaded')
                  document.addEventListener("deviceready", function () { console.log('snif') }, false);
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
            break;
          case "loading":
            // when Cordova is loading, we just stack the callbacks.
            callbacks.push(callback);
            break;
          case "ready":
            // when Cordova is ready, call the callback !
            setTimeout(callback, 10);
            break;
          default:
            throw "error";
        }
      };
    })()
  };
  // exporting Cordova to global scope
  global.Cordova = Cordova;
})(this);