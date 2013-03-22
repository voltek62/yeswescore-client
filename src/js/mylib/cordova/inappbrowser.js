 (function (Cordova, undefined) {
   "use strict";

   /**
   * In App Browser Api
   * 
   * // simple use
   * var browser = new Cordova.InAppBrowser();
   * browser.open('http://facebook.com/oauth/?foo=bar');
   * // close the browser
   * browser.close();
   *
   * // advanced use
   * var iab = new Cordova.InAppBrowser();
   * iab.open({
   *   url: 'http://facebook.com/oauth/?foo=bar'
   *   loadstart: function (e) { console.log('browsing ' + e.url); },
   *   loadend: function (e) { console.log('loadend ' + e.url); },
   *   exit: function (e) { console.log('browsing finished'); }
   * });
   * 
   */
   var InAppBrowser = function () {
     this.iabRef = null;
   };

   InAppBrowser.prototype.open = function (options) {
     if (typeof options === "string")
       options = { url: options };
     if (!options || !options.url)
       throw "missing options.url";
     //
     try {
       this.iabRef = window.open(options.url, "_blank", "location=no");
       if (options.loadstart)
         iabRef.addEventListener('loadstart', options.loadstart);
       if (options.loadstop)
         iabRef.addEventListener('loadstop', options.loadstop);
       if (options.exit)
         iabRef.addEventListener('exit', options.stop);
     } catch (e) {
       console.log('InAppBrowser erreur ' + e);
     }
   };

   InAppBrowser.prototype.close = function () {
     if (this.iabRef) {
       this.iabRef.close();
       this.iabRef = null;
     }
   };

   // registering geolocalisation only when cordova is ready.
   Cordova.deviceready(function () {
     Cordova.InAppBrowser = InAppBrowser;
     console.log("InAppBrowser ready");
   });
 })(Cordova);
