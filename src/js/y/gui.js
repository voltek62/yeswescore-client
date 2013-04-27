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
      //console.log('STATUS = ' + status);
      if (window.isMobileBrowser()) { // only on mobile browser
        _.forEach(document.querySelectorAll('*[data-input-mode="hide"]'),
                  function (node) { (status)?$(node).hide():$(node).show() });
        _.forEach(document.querySelectorAll('*[data-input-mode="show"]'),
                  function (node) { (status)?$(node).show():$(node).hide() });
        (status) ? $("#content .content-container").css("padding-top", 0) :
                    $("#content .content-container").removeAttr("style");
      }
      return true;
    }
  };

  Y.GUI = GUI;
})(Y);