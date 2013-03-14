 (function (Cordova, undefined) {
   "use strict";

   var iabRef = null;

   var InApp = {
     launchUrl: function (url) {

       try {
         // target : _blank, _self, _system
         var target = "_blank";

         iabRef = window.open(url, target, "location=no");

         iabRef.addEventListener('loadstart', this.onLoadStart.bind(this));
         iabRef.addEventListener('loadstop', this.onLoadStop.bind(this));
         iabRef.addEventListener('exit', this.onExit.bind(this));

       } catch (e) {
         console.log('INAPP erreur ' + e + ' pour ' + url);
       }
     },

     onLoadStart: function (event) {
       console.log('INAPP ' + event.type + ' - ' + event.url);

       //si url #success ou # error on kill
       if (event.url.indexOf("success") != -1 || event.url.indexOf("error") != -1) {
         console.log("INAPP SPECIAL DETECTE");

         iabRef.close();
       }
     },

     onLoadStop: function (event) {
       console.log('INAPP ' + event.type + ' - ' + event.url);
     },

     onExit: function (event) {
       console.log('INAPP ' + event.type);
     }
   };

   // registering geolocalisation only when cordova is ready.
   Cordova.deviceready(function () {
     Cordova.InApp = InApp;

     console.log("INAPP ready", Cordova.InApp);

   });
 })(Cordova);
