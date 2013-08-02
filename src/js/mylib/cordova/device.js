(function (Cordova, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  var isGingerbread = /android 2\.3/i.test(userAgent); 
  var isIOS = /(iPad|iPhone|iPod)/g.test(userAgent);
  // wrapper around cordova device 
  //  will be overrided by fake cordova in dev.
  var Device = {
    name: window.device.name,
    cordova: window.device.cordova,
    platform: window.device.platform,
    uuid: window.device.uuid,
    version: window.device.version,
    model: window.device.model,
    // custom properties
    isGingerbread: isGingerbread,
    isIOS: isIOS    
  };

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
    Cordova.Device = Device;
  });
})(Cordova);