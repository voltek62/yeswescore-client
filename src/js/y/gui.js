(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var GUI = {
    header: null,       // singleton view #header
    content: null,      // singleton current view (center)
    autocomplete: null, // singleton view #autocomplete
    navbar: null,       // singleton view #navbar
    inputMode: function (status) {
      if (window.isMobileBrowser()) { // only on mobile browser
        var $body = $("body");
        if (status) {
          $body.addClass("inputmodeon");
          $body.removeClass("inputmodeoff");
        } else {
          $body.removeClass("inputmodeon");
          $body.addClass("inputmodeoff");
        }
      }
      return true;
    }
  };

  Y.GUI = GUI;
})(Y);