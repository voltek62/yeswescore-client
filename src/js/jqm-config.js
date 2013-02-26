$(document).bind("mobileinit", function() {
  $.mobile.ajaxEnabled = false;
  $.mobile.linkBindingEnabled = false;
  $.mobile.hashListeningEnabled = false;
  $.mobile.pushStateEnabled = false;
  $.mobile.allowCrossDomainPages = true;
  // DESACTIVATE INIT FOR DOM
  // $.mobile.autoInitializePage = false;

  $.extend($.mobile, {
    // autoInitializePage : false,
    touchOverflowEnabled : false,
    slideText : "none",
    slideUpText : "none",
    defaultPageTransition : "none",
    defaultDialogTransition : "none"
  });

});
