(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  push = window.pushNotification;

  push.registerEvent('registration', function (id) {
    console.log("Registered with ID: " + id);
  };

  push.registerEvent('push', function (push) {
    alert(push);
  });

})(Y);