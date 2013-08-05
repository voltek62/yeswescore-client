(function (Cordova, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  var isGingerbread = /android 2\.3/i.test(userAgent);
  var isAndroid = /android/g.test(userAgent);   
  var isIOS = /(iPad|iPhone|iPod)/g.test(userAgent);
  // wrapper around cordova device 
  //  will be overrided by fake cordova in dev.
  var Device = {
    name: '',
    cordova: '',
    platform: '',
    uuid: '',
    version: '',
    model: '',
    // custom properties
    isGingerbread: isGingerbread,
    isIOS: isIOS,
    isAndroid : isAndroid    
  };
  
  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
  
    if (typeof window.device !== "undefined") {
      Device.name     = window.device.name;
      Device.cordova  = window.device.cordova;
      Device.platform = window.device.platform;
      Device.uuid     = window.device.uuid;
      Device.version  = window.device.version;
      Device.model    = window.device.model;
    }  
  
    Cordova.Device = Device;
  
  });
})(Cordova);